function UpgradesContents({ upgradesContents, buyUpgradeContents, money }) {
    return (
        <div className="upgrades-sidebar">
            <h3 className="upgrades-title">Upgrades Contents</h3>
            {upgradesContents.map((up) => {
                const currentPrice = up.currentCost;

                return (
                    <div key={up.id} className="upgrade-card">
                        <span className="upgrade-name">{up.title}</span>
                        <span className="upgrade-level">Lvl {up.level}</span>
                        <button
                            className="upgradeButton"
                            onClick={() => buyUpgradeContents(up.id)}
                            disabled={money < currentPrice}
                        >
                            Upgrade: {currentPrice} coins
                        </button>
                    </div>
                );
            })}
        </div>
    )
}

export default UpgradesContents