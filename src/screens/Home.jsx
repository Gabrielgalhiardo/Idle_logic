import Server from '../components/server/Server.jsx'
import './Home.css'

function Home({
    serverLevel,
    isServerMax,
    money,
    passiveIncome,
    progressSpeedMultiplier,
    onProgressComplete,
    buyServerUpgrade,
    priceUpgrade,
    upgradesContents,
    buyUpgradeContents,
    doPrestige,
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
                isServerMax={isServerMax}
                doPrestige={doPrestige}
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