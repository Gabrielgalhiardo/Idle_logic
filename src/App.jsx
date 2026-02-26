import { useCallback, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './screens/Home.jsx'
import LojaComponentes from './screens/LojaComponentes.jsx'

const STORAGE_KEY = 'idle_logic_state_v1'

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
  { id: 'ram', title: 'Memoria RAM', level: 0, basePrice: 180, description: 'Aumenta a multitarefa do PC.' },
  { id: 'ssd', title: 'SSD', level: 0, basePrice: 320, description: 'Carregamento e boot mais rapido.' },
  { id: 'hdd', title: 'HDD', level: 0, basePrice: 140, description: 'Mais espaco para arquivos.' },
  { id: 'cpu', title: 'Processador', level: 0, basePrice: 520, description: 'Mais poder de processamento.' },
  { id: 'gpu', title: 'Placa de Video', level: 0, basePrice: 800, description: 'Melhora o desempenho gráfico.' },
  { id: 'psu', title: 'Fonte de Alimentação', level: 0, basePrice: 300, description: 'Fornece energia estável para o PC.' },
  { id: 'cooler', title: 'Sistema de Resfriamento', level: 0, basePrice: 250, description: 'Mantém o PC fresco durante o uso intenso.' },
  { id: 'motherboard', title: 'Placa-Mãe', level: 0, basePrice: 400, description: 'Conecta todos os componentes do PC.' },
  { id: 'case', title: 'Gabinete', level: 0, basePrice: 150, description: 'Protege os componentes e melhora a estética.' },
  { id: 'monitor', title: 'Monitor', level: 0, basePrice: 600, description: 'Melhora a qualidade visual e a experiência de jogo.' }
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
  } catch (error) {
    // Ignore write errors (storage full, disabled, etc.)
  }
}

function App() {
  const storedState = useMemo(() => loadState(), [])

  const [serverLevel, setServerLevel] = useState(() =>
    toSafeNumber(storedState?.serverLevel, 1)
  )
  const [money, setMoney] = useState(() =>
    toSafeNumber(storedState?.money, 0)
  )

  const [upgradesContents, setUpgradesContents] = useState(() =>
    mergeWithDefaults(DEFAULT_UPGRADES, storedState?.upgradesContents)
  )

  const [storeItems, setStoreItems] = useState(() =>
    mergeWithDefaults(DEFAULT_STORE_ITEMS, storedState?.storeItems)
  )

  const storeEffects = useMemo(() => {
    const ramLevel = storeItems.find(item => item.id === 'ram')?.level ?? 0
    const ssdLevel = storeItems.find(item => item.id === 'ssd')?.level ?? 0
    const hddLevel = storeItems.find(item => item.id === 'hdd')?.level ?? 0
    const cpuLevel = storeItems.find(item => item.id === 'cpu')?.level ?? 0
    const gpuLevel = storeItems.find(item => item.id === 'gpu')?.level ?? 0
    const psuLevel = storeItems.find(item => item.id === 'psu')?.level ?? 0
    const coolerLevel = storeItems.find(item => item.id === 'cooler')?.level ?? 0
    const motherboardLevel = storeItems.find(item => item.id === 'motherboard')?.level ?? 0
    const caseLevel = storeItems.find(item => item.id === 'case')?.level ?? 0
    const monitorLevel = storeItems.find(item => item.id === 'monitor')?.level ?? 0

    return {
      // Aqui é os boost dos components
      clickBonus: (cpuLevel * 3) + (gpuLevel * 5) + (ramLevel * 1.5),
      passiveBonus: (ssdLevel * 4) + (hddLevel * 2) + (motherboardLevel * 3) ,
      speedMultiplier: 1 + (coolerLevel * 0.02) + (psuLevel * 0.015) + (caseLevel * 0.01) + (monitorLevel * 0.025)
    }
  }, [storeItems])

  const passiveIncomePerSecond = useMemo(
    () => upgradesContents.reduce((acc, up) => acc + (up.level * up.multiplier), 0) + storeEffects.passiveBonus,
    [upgradesContents, storeEffects.passiveBonus] // Aqui é junto com os upgrades 
  )

  const serverUpgradeCost = Math.floor(100 * Math.pow(1.5, serverLevel - 1))

  const calculateUpgradeCost = (basePrice, level) => Math.floor(basePrice * Math.pow(1.15, level))
  const calculateStoreItemCost = (basePrice, level) => Math.floor(basePrice * Math.pow(1.2, level))

  useEffect(() => {
    if (passiveIncomePerSecond <= 0) return

    const interval = setInterval(() => {
      setMoney(prev => prev + (passiveIncomePerSecond / 10))
    }, 100)

    return () => clearInterval(interval)
  }, [passiveIncomePerSecond])

  useEffect(() => {
    saveState({
      serverLevel,
      money,
      upgradesContents,
      storeItems
    })
  }, [serverLevel, money, upgradesContents, storeItems])

  const handleServerProgressComplete = useCallback(() => {
    const chatBonus = upgradesContents.find(u => u.id === 'chat-upgrade').level * 2
    const clickValue = (serverLevel * 5) + chatBonus + storeEffects.clickBonus

    setMoney(prev => prev + clickValue)
  }, [serverLevel, upgradesContents, storeEffects.clickBonus])

  function buyUpgradeContents(id) {
    const upgrade = upgradesContents.find(u => u.id === id)
    if (!upgrade) return

    const cost = calculateUpgradeCost(upgrade.basePrice, upgrade.level)

    if (money >= cost) {
      setMoney(prev => prev - cost)
      setUpgradesContents(prevList =>
        prevList.map(item =>
          item.id === id ? { ...item, level: item.level + 1 } : item
        )
      )
    }
  }

  function buyServerUpgrade() {
    if (money >= serverUpgradeCost) {
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
      setStoreItems(prevList =>
        prevList.map(entry =>
          entry.id === id ? { ...entry, level: entry.level + 1 } : entry
        )
      )
    }
  }

  const upgradesWithCosts = useMemo(() =>
    upgradesContents.map(u => ({
      ...u,
      currentCost: calculateUpgradeCost(u.basePrice, u.level)
    })),
    [upgradesContents]
  )

  const storeItemsWithCosts = useMemo(() =>
    storeItems.map(item => ({
      ...item,
      currentCost: calculateStoreItemCost(item.basePrice, item.level)
    })),
    [storeItems]
  )

  const reset = () => {
    //perguntar se quer resetar
    if (window.confirm("Tem certeza que deseja resetar o jogo?")) {
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
              money={money}
              passiveIncome={passiveIncomePerSecond}
              progressSpeedMultiplier={storeEffects.speedMultiplier}
              onProgressComplete={handleServerProgressComplete}
              buyServerUpgrade={buyServerUpgrade}
              priceUpgrade={serverUpgradeCost}
              upgradesContents={upgradesWithCosts}
              buyUpgradeContents={buyUpgradeContents}
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
        <Route path="*" 
        element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
