import { useNavigate } from 'react-router-dom'
import './LojaComponentes.css'

function LojaComponentes({ money, passiveIncome, storeItems, buyStoreItem }) {
    const navigate = useNavigate()

    return (
        <div className="store-container">
            <header className="store-header">
                <div className="store-title-group">
                    <span className="store-kicker">Loja de Componentes</span>
                    <h2>Melhore seu computador</h2>
                </div>
                <button className="storeBackButton" onClick={() => navigate('/')}>Voltar</button>
            </header>

            <section className="store-stats">
                <div className="storeStatCard">
                    <span className="storeStatLabel">Coins</span>
                    <span className="storeStatValue">{money.toLocaleString()}</span>
                </div>
                <div className="storeStatCard">
                    <span className="storeStatLabel">Renda Passiva</span>
                    <span className="storeStatValue">R$ {passiveIncome.toLocaleString()}/s</span>
                </div>
            </section>

            <section className="store-content">
                <div className="store-items">
                    {storeItems.map((item) => (
                        <div key={item.id} className="store-item-card">
                            <div className="store-item-header">
                                <span className="store-item-name">{item.title}</span>
                                <span className="store-item-level">Nivel {item.level}</span>
                            </div>
                            <p className="store-item-desc">{item.description}</p>
                            <button
                                className="storeItemButton"
                                onClick={() => buyStoreItem(item.id)}
                                disabled={money < item.currentCost}
                            >
                                Comprar: {item.currentCost.toLocaleString()} coins
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default LojaComponentes
