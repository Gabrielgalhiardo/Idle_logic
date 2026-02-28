import { useNavigate } from 'react-router-dom'
import './LojaPrestigio.css'

function LojaPrestigio({ techTokens, prestigeUpgrades, buyPrestigeUpgrade }) {
    const navigate = useNavigate()

    return (
        <div className="prestige-container">
            <header className="prestige-header">
                <div className="prestige-title-group">
                    <span className="prestige-kicker">Loja de Prestígio</span>
                    <h2>Habilidades Permanentes</h2>
                </div>
                <button className="prestigeBackButton" onClick={() => navigate('/')}>Voltar</button>
            </header>

            <section className="prestige-stats">
                <div className="prestigeStatCard">
                    <span className="prestigeStatLabel">Tech Tokens</span>
                    <span className="prestigeStatValue">{techTokens.toLocaleString()}</span>
                </div>
            </section>

            <section className="prestige-content">
                <div className="prestige-items">
                    {prestigeUpgrades.map((upgrade) => {
                        const isMaxLevel = upgrade.level >= upgrade.maxLevel
                        const canBuy = techTokens >= upgrade.cost && !isMaxLevel

                        return (
                            <div key={upgrade.id} className="prestige-item-card">
                                <div className="prestige-item-header">
                                    <span className="prestige-item-name">{upgrade.title}</span>
                                    <span className="prestige-item-level">Nível {upgrade.level}/{upgrade.maxLevel}</span>
                                </div>

                                <p className="prestige-item-desc">{upgrade.description}</p>

                                <button
                                    className="prestigeItemButton"
                                    onClick={() => buyPrestigeUpgrade(upgrade.id)}
                                    disabled={!canBuy}
                                >
                                    {isMaxLevel ? 'Maximizado' : `Comprar: ${upgrade.cost} Token${upgrade.cost > 1 ? 's' : ''}`}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}

export default LojaPrestigio
