import { useCallback, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './screens/Home.jsx'
import LojaComponentes from './screens/LojaComponentes.jsx'
import LojaPrestigio from './screens/LojaPrestigio.jsx'

const STORAGE_KEY = 'idle_logic_state_v3' // Atualizado para v3 para aceitar a nova economia

const BASE_MAX_SERVER_LEVEL = 15;

const DEFAULT_UPGRADES = [
  { id: 'chat-upgrade', title: 'Bot de Chat', level: 0, basePrice: 50, multiplier: 2 },
  { id: 'storage-upgrade', title: 'Data Center', level: 0, basePrice: 250, multiplier: 12 },
  { id: 'security-upgrade', title: 'Criptografia', level: 0, basePrice: 1200, multiplier: 65 },
  { id: 'network-upgrade', title: 'Fibra Otica', level: 0, basePrice: 6000, multiplier: 350 },
  { id: 'ai-upgrade', title: 'IA Avancada', level: 0, basePrice: 30000, multiplier: 2000 },
  { id: 'quantum-upgrade', title: 'Computacao Quantica', level: 0, basePrice: 150000, multiplier: 12000 },
  { id: 'nano-upgrade', title: 'Nanotecnologia', level: 0, basePrice: 750000, multiplier: 80000 },
  { id: 'fusion-upgrade', title: 'Energia de Fusao', level: 0, basePrice: 4000000, multiplier: 500000 },
  { id: 'galactic-upgrade', title: 'Expansao Galatica', level: 0, basePrice: 20000000, multiplier: 3000000 },
  { id: 'multiverse-upgrade', title: 'Exploracao Multiverso', level: 0, basePrice: 100000000, multiplier: 20000000 }
]

const DEFAULT_STORE_ITEMS = [
  { id: 'ram', title: 'Memoria RAM', level: 0, basePrice: 180, description: '+10% de ganho por clique.' },
  { id: 'ssd', title: 'SSD', level: 0, basePrice: 320, description: '+15% de renda passiva.' },
  { id: 'hdd', title: 'HDD', level: 0, basePrice: 140, description: '+5% de renda passiva.' },
  { id: 'cpu', title: 'Processador', level: 0, basePrice: 520, description: '+25% de ganho por clique.' },
  { id: 'gpu', title: 'Placa de Video', level: 0, basePrice: 800, description: '+40% de ganho por clique.' },
  { id: 'psu', title: 'Fonte de Alimentação', level: 0, basePrice: 300, description: '+2% de velocidade global.' },
  { id: 'cooler', title: 'Sistema de Resfriamento', level: 0, basePrice: 250, description: '+3% de velocidade global.' },
  { id: 'motherboard', title: 'Placa-Mãe', level: 0, basePrice: 400, description: '+10% em todos os ganhos.' },
  { id: 'case', title: 'Gabinete', level: 0, basePrice: 150, description: '+1% de velocidade global.' },
  { id: 'monitor', title: 'Monitor', level: 0, basePrice: 600, description: '+5% de velocidade global.' }
]

// Novidade: Lista de Habilidades Permanentes
const DEFAULT_PRESTIGE_UPGRADES = [
  { id: 'overclock', title: 'Overclock Global', level: 0, maxLevel: 10, cost: 1, description: '+30% de Renda Passiva por nível.' },
  { id: 'desconto-loja', title: 'Contratos VIP', level: 0, maxLevel: 5, cost: 2, description: 'Reduz o preço dos Componentes em 35% por nível.' },
  { id: 'clique-passivo', title: 'Engenharia Reversa', level: 0, maxLevel: 5, cost: 3, description: 'Seu clique ganha +15% da sua Renda Passiva por nível.' },
  { id: 'limite-server', title: 'Quebra de Limites', level: 0, maxLevel: 2, cost: 5, description: 'Aumenta o Nível Máximo do Servidor em +1.' }
]

function toSafeNumber(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function mergeWithDefaults(defaultList, storedList) {
  const storedById = new Map((storedList ?? []).map(item => [item.id, item]))
  return defaultList.map(item => {
    const stored = storedById.get(item.id)
    const level = toSafeNumber(stored?.level, item.level)
    return { ...item, level: Math.max(0, Math.floor(level)) }
  })
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (error) {
    return null
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) { }
}

function App() {
  const storedState = useMemo(() => loadState(), [])

  // Estados Base
  const [serverLevel, setServerLevel] = useState(() => toSafeNumber(storedState?.serverLevel, 1))
  const [money, setMoney] = useState(() => toSafeNumber(storedState?.money, 0))
  const [upgradesContents, setUpgradesContents] = useState(() => mergeWithDefaults(DEFAULT_UPGRADES, storedState?.upgradesContents))
  const [storeItems, setStoreItems] = useState(() => mergeWithDefaults(DEFAULT_STORE_ITEMS, storedState?.storeItems))

  // Estados de Prestígio
  const [techTokens, setTechTokens] = useState(() => toSafeNumber(storedState?.techTokens, 0))
  const [prestigeUpgrades, setPrestigeUpgrades] = useState(() => mergeWithDefaults(DEFAULT_PRESTIGE_UPGRADES, storedState?.prestigeUpgrades))

  // Efeitos do Prestígio (Permanentes)
  const prestigeEffects = useMemo(() => {
    const getLvl = (id) => prestigeUpgrades.find(u => u.id === id)?.level ?? 0;
    return {
      passiveMultiplier: 1 + (getLvl('overclock') * 0.30),
      storeDiscount: 1 - (getLvl('desconto-loja') * 0.35),
      clickPassiveBonus: getLvl('clique-passivo') * 0.15,
      extraMaxServerLevel: getLvl('limite-server')
    }
  }, [prestigeUpgrades])

  // Efeitos da Loja de Componentes
  const storeEffects = useMemo(() => {
    const getLevel = (id) => storeItems.find(item => item.id === id)?.level ?? 0
    const moboLvl = getLevel('motherboard')
    const globalMultiplier = 1 + (moboLvl * 0.10); 

    return {
      clickMultiplier: (1 + (getLevel('cpu') * 0.25) + (getLevel('gpu') * 0.40) + (getLevel('ram') * 0.10)) * globalMultiplier,
      passiveMultiplier: (1 + (getLevel('ssd') * 0.15) + (getLevel('hdd') * 0.05)) * globalMultiplier,
      speedMultiplier: 1 + (getLevel('cooler') * 0.03) + (getLevel('psu') * 0.02) + (getLevel('case') * 0.01) + (getLevel('monitor') * 0.05)
    }
  }, [storeItems])

  // Renda Passiva = Base * Bônus da Loja * Bônus de Prestígio
  const passiveIncomePerSecond = useMemo(() => {
    const basePassive = upgradesContents.reduce((acc, up) => acc + (up.level * up.multiplier), 0);
    return basePassive * storeEffects.passiveMultiplier * prestigeEffects.passiveMultiplier;
  }, [upgradesContents, storeEffects.passiveMultiplier, prestigeEffects.passiveMultiplier])

  // Nível Máximo do Servidor agora é dinâmico (Graças à "Quebra de Limites")
  const currentMaxServerLevel = BASE_MAX_SERVER_LEVEL + prestigeEffects.extraMaxServerLevel;
  const isServerMax = serverLevel >= currentMaxServerLevel;
  const serverUpgradeCost = isServerMax ? Infinity : Math.floor(100 * Math.pow(3.5, serverLevel - 1))

  const calculateUpgradeCost = (basePrice, level) => Math.floor(basePrice * Math.pow(1.15, level))
  
  // O custo dos componentes agora tem o desconto VIP do Prestígio
  const calculateStoreItemCost = (basePrice, level) => {
    const cost = Math.floor(basePrice * Math.pow(1.2, level));
    return Math.floor(cost * prestigeEffects.storeDiscount);
  }

  // Engine do Jogo (Ganhos Passivos)
  useEffect(() => {
    if (passiveIncomePerSecond <= 0) return
    const interval = setInterval(() => setMoney(prev => prev + (passiveIncomePerSecond / 10)), 100)
    return () => clearInterval(interval)
  }, [passiveIncomePerSecond])

  // Salvamento Automático
  useEffect(() => {
    saveState({ serverLevel, money, upgradesContents, storeItems, techTokens, prestigeUpgrades })
  }, [serverLevel, money, upgradesContents, storeItems, techTokens, prestigeUpgrades])

  // Lógica do Clique
  const handleServerProgressComplete = useCallback(() => {
    const chatBonus = upgradesContents.find(u => u.id === 'chat-upgrade').level * 2
    const baseServerClick = 5 * Math.pow(1.8, serverLevel - 1); 
    
    let clickValue = (baseServerClick + chatBonus) * storeEffects.clickMultiplier
    
    // Adiciona o bônus passivo no clique (Engenharia Reversa)
    clickValue += (passiveIncomePerSecond * prestigeEffects.clickPassiveBonus);

    setMoney(prev => prev + clickValue)
  }, [serverLevel, upgradesContents, storeEffects.clickMultiplier, passiveIncomePerSecond, prestigeEffects.clickPassiveBonus])

  // Ações de Compra Padrões
  function buyUpgradeContents(id) {
    const upgrade = upgradesContents.find(u => u.id === id)
    if (!upgrade) return
    const cost = calculateUpgradeCost(upgrade.basePrice, upgrade.level)
    if (money >= cost) {
      setMoney(prev => prev - cost)
      setUpgradesContents(prevList => prevList.map(item => item.id === id ? { ...item, level: item.level + 1 } : item))
    }
  }

  function buyServerUpgrade() {
    if (!isServerMax && money >= serverUpgradeCost) {
      setMoney(prev => prev - serverUpgradeCost)
      setServerLevel(prev => prev + 1)
    }
  }

  function buyStoreItem(id) {
    const item = storeItems.find(entry => entry.id === id)
    if (!item) return
    const cost = calculateStoreItemCost(item.basePrice, item.level)
    if (money >= cost) {
      setMoney(prev => prev - cost)
      setStoreItems(prevList => prevList.map(entry => entry.id === id ? { ...entry, level: entry.level + 1 } : entry))
    }
  }

  // --------- NOVO: FUNÇÕES DE PRESTÍGIO ---------

  function doPrestige() {
    if (!isServerMax) return; 

    if (window.confirm("Iniciar Prestígio? Você ganhará 1 Tech Token, mas perderá seu Dinheiro e Componentes da jogada atual!")) {
      setTechTokens(prev => prev + 1); 
      
      // Reseta a Run
      setServerLevel(1);
      setMoney(0);
      setUpgradesContents(DEFAULT_UPGRADES);
      setStoreItems(DEFAULT_STORE_ITEMS);
    }
  }

  function buyPrestigeUpgrade(id) {
    const upgrade = prestigeUpgrades.find(u => u.id === id);
    if (!upgrade) return;

    if (upgrade.level < upgrade.maxLevel && techTokens >= upgrade.cost) {
      setTechTokens(prev => prev - upgrade.cost);
      setPrestigeUpgrades(prevList =>
        prevList.map(item =>
          item.id === id ? { ...item, level: item.level + 1 } : item
        )
      );
    }
  }

  // ----------------------------------------------

  const upgradesWithCosts = useMemo(() => upgradesContents.map(u => ({ ...u, currentCost: calculateUpgradeCost(u.basePrice, u.level) })), [upgradesContents])
  const storeItemsWithCosts = useMemo(() => storeItems.map(item => ({ ...item, currentCost: calculateStoreItemCost(item.basePrice, item.level) })), [storeItems, prestigeEffects.storeDiscount])

  const reset = () => {
    if (window.confirm("Hard Reset: Tem certeza? TODO seu progresso, INCLUSIVE PRESTÍGIO, será perdido.")) {
      localStorage.removeItem(STORAGE_KEY)
      window.location.reload()
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              serverLevel={serverLevel}
              isServerMax={isServerMax}
              currentMaxServerLevel={currentMaxServerLevel}
              money={money}
              passiveIncome={passiveIncomePerSecond}
              progressSpeedMultiplier={storeEffects.speedMultiplier}
              onProgressComplete={handleServerProgressComplete}
              buyServerUpgrade={buyServerUpgrade}
              priceUpgrade={serverUpgradeCost}
              upgradesContents={upgradesWithCosts}
              buyUpgradeContents={buyUpgradeContents}
              doPrestige={doPrestige} // Passa a função pro botão da Home
              reset={reset}
            />
          }
        />
        <Route
          path="/loja-componentes"
          element={
            <LojaComponentes
              money={money}
              passiveIncome={passiveIncomePerSecond}
              storeItems={storeItemsWithCosts}
              buyStoreItem={buyStoreItem}
            />
          }
        />
        <Route
          path="/prestigio"
          element={
            <LojaPrestigio
              techTokens={techTokens}
              prestigeUpgrades={prestigeUpgrades}
              buyPrestigeUpgrade={buyPrestigeUpgrade}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App