import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UpgradesContents from '../upgrades_contents/UpgradesContents.jsx'
import './Server.css'

function Server({ serverLevel, money, passiveIncome, progressSpeedMultiplier, onProgressComplete, buyServerUpgrade, priceUpgrade, upgradesContents, buyUpgradeContents }) {
    const [progress, setProgress] = useState(0)
    const navigate = useNavigate()

    function goToElectronicsStore() {
        navigate('/loja-componentes')
    }

    useEffect(() => {
        const progressPerTick = (1 + Math.floor(serverLevel / 2)) * (progressSpeedMultiplier ?? 1)
        const tickInterval = Math.max(12, (80 - serverLevel * 3) / (progressSpeedMultiplier ?? 1))

        const intervalId = setInterval(() => {
            setProgress((currentProgress) => {
                if (currentProgress >= 100) {
                    return 0
                }

                const nextProgress = currentProgress + progressPerTick
                return nextProgress >= 100 ? 100 : nextProgress
            })
        }, tickInterval)

        return () => clearInterval(intervalId)
    }, [serverLevel])

    useEffect(() => {
        if (progress === 100) {
            onProgressComplete?.()
        }
    }, [progress, onProgressComplete])

    return (
        <div className="mainContainerServer">
            <div className="serverHeader">
                <div className="serverTitleGroup">
                    <span className="serverTitle">Server Core</span>
                    <span className="serverLevel">Level {serverLevel}</span>
                </div>
                <div className="serverMoney">
                    <span className="moneyLabel">Coins</span>
                    <span className="moneyValue">{money.toLocaleString()}</span>
                </div>
            </div>
            <div className="serverContent">
                <div className="passiveIncomeCard">
                    <span className="passiveIncomeLabel">Renda Passiva</span>
                    <span className="passiveIncomeValue">R$ {passiveIncome.toLocaleString()}/s</span>
                </div>
                <div className="storeNavigationCard">
                    <span className="storeNavigationText">Melhore seu computador na loja de componentes eletrônicos</span>
                    <button className="storeNavigationButton" onClick={goToElectronicsStore}>
                        Ir para Loja de Componentes
                    </button>
                </div>
                <div className="serverUpgradeContainer">
                    <h3>Upgrade Server</h3>
                    <button
                        className="upgradeButton"
                        onClick={() => buyServerUpgrade()}
                        disabled={money < priceUpgrade}
                    >
                        Upgrade {priceUpgrade.toLocaleString()} coins
                    </button>
                </div>
                <div className="serverImageContainer">
                    <img src={`/assets/serverImagens/${serverLevel}.png`} alt="SERVIDOR" className="imageServer" />
                </div>
                <div className="progressBarServer">
                    <div className="progressBarFillServer" style={{ width: `${progress}%` }}></div>
                </div>
                <UpgradesContents
                    upgradesContents={upgradesContents}
                    buyUpgradeContents={buyUpgradeContents}
                    money={money}
                />
            </div>
        </div>
    )
}
export default Server;