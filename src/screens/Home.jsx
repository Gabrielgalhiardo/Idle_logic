import Server from '../components/server/Server.jsx'
import './Home.css'

function Home({
    serverLevel,
    money,
    passiveIncome,
    progressSpeedMultiplier,
    onProgressComplete,
    buyServerUpgrade,
    priceUpgrade,
    upgradesContents,
    buyUpgradeContents
}) {
    return (
        <div className="game-container">
            <Server
                serverLevel={serverLevel}
                money={money}
                passiveIncome={passiveIncome}
                progressSpeedMultiplier={progressSpeedMultiplier}
                onProgressComplete={onProgressComplete}
                buyServerUpgrade={buyServerUpgrade}
                priceUpgrade={priceUpgrade}
                upgradesContents={upgradesContents}
                buyUpgradeContents={buyUpgradeContents}
            />
        </div>
    )
}

export default Home