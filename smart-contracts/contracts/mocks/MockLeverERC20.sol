// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interfaces/IERC20Long.sol";
import "../test/BasicPriceOracle.sol";

contract MockLeverERC20 is ERC20, IERC20Long {
    using SafeMath for uint256;

    uint256 public constant THRESHHOLD = 200;
    uint256 public constant SCALE = 1000000;
    uint256 public immutable targetRatio;

    IERC20 public collatToken;
    address public debtToken;
    BasicPriceOracle public oracle;

    uint256 internal _underlyingCollat;
    uint256 internal _underlyingDebt;

    constructor(
        string memory name_,
        string memory symbol_,
        address debtToken_,
        IERC20 collatToken_,
        BasicPriceOracle oracle_,
        uint256 targetRatio_
    )
        ERC20(name_, symbol_)
    {
        debtToken = debtToken_;
        collatToken = collatToken_;
        oracle = oracle_;
        require(targetRatio_ <= SCALE, "Invalid ratio");
        targetRatio = targetRatio_;
    }

    function mint(uint256 amount) external override {
        collatToken.transferFrom(msg.sender, address(this), amount);

        if (totalSupply() == 0) {
            _underlyingCollat = _underlyingCollat.add(amount);
            emit Rebalance(_rebalance(), 0, _getRatio());
            _mint(msg.sender, amount);
            _emitEquity();
            return;
        }

        uint256 beforeRatio = _getRatio();
        _underlyingCollat = _underlyingCollat.add(amount);

        if (_withinThreshhold()) {
            return;
        }

        bool positive = _rebalance();
        uint256 afterRatio = _getRatio();

        emit Rebalance(positive, beforeRatio, afterRatio);
    }

    function rebalance() public override {
        if (_withinThreshhold()) {
            return;
        }
        uint256 beforeRatio = _getRatio();
        bool positive = _rebalance();
        uint256 afterRatio = _getRatio();

        emit Rebalance(positive, beforeRatio, afterRatio);
        _emitEquity();
    }

    function redeem(uint256 amount) external override {
        _redeemTo(msg.sender, amount);
    }

    function redeemTo(address recipient, uint256 amount)
        external
        override
    {
        _redeemTo(recipient, amount);
    }

    function _redeemTo(address recipient, uint256 amount) internal {
        require(amount > 0, "Can't redeem nothing");
        require(amount >= balanceOf(msg.sender), "Insufficient balance");

        rebalance();

        uint256 debtShare = _underlyingDebt.mul(amount).div(totalSupply());
        uint256 swappedCollat = _getDebtAsCollat(debtShare);

        _underlyingDebt = _underlyingDebt.sub(debtShare);
        _underlyingCollat = _underlyingCollat.sub(swappedCollat);

        uint256 equity = _underlyingCollat.sub(_getDebtAsCollat(_underlyingDebt));
        uint256 equityShare = equity.mul(amount).div(totalSupply());

        _underlyingCollat = _underlyingCollat.sub(equity);
        collatToken.transfer(recipient, equityShare);
        _burn(msg.sender, amount);

        _emitEquity();
    }

    function _makeRandom(uint256 value) internal view returns(uint256) {
        bytes32 weakSeed = keccak256(abi.encodePacked(
            block.number,
            block.timestamp
        ));
        uint256 randomWitdth = 2000;
        return value.sub(randomWitdth).add(uint256(weakSeed) % (randomWitdth * 2));
    }

    function _getRatio() internal view returns(uint256) {
        uint256 debtUsd = _debtPrice().mul(_underlyingDebt);
        uint256 collatUsd = _collatPrice().mul(_underlyingCollat);
        return debtUsd.mul(SCALE).div(collatUsd);
    }

    function _rebalance() internal returns(bool) {
        uint256 currentRatio = _getRatio();
        assert(!_withinThreshhold());


        uint256 debtUsd = _debtPrice().mul(_underlyingDebt);
        uint256 collatUsd = _collatPrice().mul(_underlyingCollat);

        if (currentRatio < targetRatio) {
            uint256 rebalanceValueUsd =
                targetRatio.mul(collatUsd).sub(debtUsd.mul(SCALE)).div(
                    SCALE.sub(targetRatio)
                );
            uint256 collatBorrow = rebalanceValueUsd.div(_collatPrice());
            uint256 debtBorrow = rebalanceValueUsd.div(_debtPrice());
            _underlyingDebt = _underlyingDebt.add(debtBorrow);
            _underlyingCollat = _underlyingCollat.add(collatBorrow);
            return true;
        } else {
            uint256 rebalanceValueUsd =
                debtUsd.mul(SCALE).sub(targetRatio.mul(collatUsd)).div(
                    SCALE.sub(targetRatio)
                );
            uint256 debtBorrow = rebalanceValueUsd.div(_debtPrice());
            uint256 collatWithdraw = rebalanceValueUsd.div(_collatPrice());

            _underlyingDebt = _underlyingDebt.sub(debtBorrow);
            _underlyingCollat = _underlyingCollat.sub(collatWithdraw);
            return false;
        }
    }

    function _getDebtAsCollat(uint256 debt) internal view returns(uint256) {
        return debt.mul(_debtPrice()).div(_collatPrice());
    }

    function _emitEquity() internal {
        uint256 debtAsCollat = _getDebtAsCollat(_underlyingDebt);
        if (_underlyingCollat > debtAsCollat) {
            emit Equity(_underlyingCollat - debtAsCollat, 0);
        } else {
            emit Equity(0, debtAsCollat - _underlyingCollat);
        }
    }

    function _withinThreshhold() internal view returns(bool) {
        uint256 currentRatio = _getRatio();

        uint256 diff = currentRatio > targetRatio
            ? (currentRatio - targetRatio)
            : (targetRatio - currentRatio);
        return diff <= THRESHHOLD;
    }

    function _collatPrice() internal view returns(uint256) {
        return oracle.prices(address(collatToken));
    }

    function _debtPrice() internal view returns(uint256) {
        return oracle.prices(debtToken);
    }
}
