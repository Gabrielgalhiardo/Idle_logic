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
    buyUpgradeContents,
    reset
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
            <div className='reset-button'>
                <button onClick={() => reset()}>
                    Resetar Jogo
                </button>
            </div>
        </div>
    )
}

export default Home