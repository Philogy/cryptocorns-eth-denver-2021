// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interfaces/IEthERC20Long.sol";
import "../test/BasicPriceOracle.sol";

contract MockLeverToken is ERC20, IEthERC20Long {
    using SafeMath for uint256;

    uint256 public constant THRESHHOLD = 200;
    uint256 public constant SCALE = 1000000;
    uint256 public immutable targetRatio;

    IERC20 public debtToken;
    BasicPriceOracle public oracle;

    uint256 internal _underlyingCollat;
    uint256 internal _underlyingDebt;

    constructor(
        string memory name_,
        string memory symbol_,
        IERC20 debtToken_,
        BasicPriceOracle oracle_,
        uint256 targetRatio_
    )
        ERC20(name_, symbol_)
    {
        debtToken = debtToken_;
        oracle = oracle_;
        require(targetRatio_ <= SCALE, "Invalid ratio");
        targetRatio = targetRatio_;
    }

    function mint() external override payable {
        if (totalSupply() == 0) {
            _underlyingCollat = _underlyingCollat.add(msg.value);
            emit Rebalance(_rebalance(), 0, _getRatio());
            _mint(msg.sender, msg.value);
            _emitEquity();
            return;
        }

        uint256 beforeRatio = _getRatio();
        _underlyingCollat = _underlyingCollat.add(msg.value);

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

    function redeemTo(address payable recipient, uint256 amount)
        external
        override
    {
        _redeemTo(recipient, amount);
    }

    function _redeemTo(address payable recipient, uint256 amount) internal {
        require(amount > 0, "Can't redeem nothing");
        require(amount >= balanceOf(msg.sender), "Insufficient balance");

        rebalance();

        uint256 debtShare = _underlyingDebt.mul(amount).div(totalSupply());
        uint256 swappedCollat = _getDebtAsCollat(debtShare);

        _underlyingDebt = _underlyingDebt.sub(debtShare, "A");
        _underlyingCollat = _underlyingCollat.sub(swappedCollat, "B");

        uint256 equity = _underlyingCollat.sub(_getDebtAsCollat(_underlyingDebt), "C");
        uint256 equityShare = equity.mul(amount).div(totalSupply());

        _underlyingCollat = _underlyingCollat.sub(equity, "D");
        recipient.transfer(equityShare);
        _burn(msg.sender, amount);

        _emitEquity();
    }

    function _makeRandom(uint256 value) internal view returns(uint256) {
        bytes32 weakSeed = keccak256(abi.encodePacked(
            block.number,
            block.timestamp
        ));
        uint256 randomWitdth = 2000;
        return value.sub(randomWitdth, "E").add(uint256(weakSeed) % (randomWitdth * 2));
    }

    function _getRatio() internal view returns(uint256) {
        uint256 debtUsd = oracle.prices(address(debtToken)).mul(_underlyingDebt);
        uint256 collatUsd = oracle.prices(address(0)).mul(_underlyingCollat);
        return debtUsd.mul(SCALE).div(collatUsd);
    }

    function _rebalance() internal returns(bool) {
        uint256 currentRatio = _getRatio();
        assert(!_withinThreshhold());


        uint256 debtUsd = oracle.prices(address(debtToken)).mul(_underlyingDebt);
        uint256 collatUsd = oracle.prices(address(0)).mul(_underlyingCollat);

        if (currentRatio < targetRatio) {
            uint256 rebalanceValueUsd =
                targetRatio.mul(collatUsd).sub(debtUsd.mul(SCALE), "F").div(
                    SCALE.sub(targetRatio, "G")
                );
            uint256 collatBorrow = rebalanceValueUsd.div(oracle.prices(address(0)));
            uint256 debtBorrow = rebalanceValueUsd.div(oracle.prices(address(debtToken)));
            _underlyingDebt = _underlyingDebt.add(debtBorrow);
            _underlyingCollat = _underlyingCollat.add(collatBorrow);
            return true;
        } else {
            uint256 rebalanceValueUsd =
                debtUsd.mul(SCALE).sub(targetRatio.mul(collatUsd), "H").div(
                    SCALE.sub(targetRatio, "I")
                );
            uint256 debtBorrow = rebalanceValueUsd.div(oracle.prices(address(debtToken)));
            uint256 collatWithdraw = rebalanceValueUsd.div(oracle.prices(address(0)));

            _underlyingDebt = _underlyingDebt.sub(debtBorrow, "J");
            _underlyingCollat = _underlyingCollat.sub(collatWithdraw, "K");
            return false;
        }
    }

    function _getDebtAsCollat(uint256 debt) internal view returns(uint256) {
        return debt.mul(
            oracle.prices(address(debtToken))
        ).div(
            oracle.prices(address(0))
        );

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
}
