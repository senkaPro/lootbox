class LootBoxSystem {
  constructor() {
    this.balance = 10000
    this.openingCount = 0;
    this.categoryProbabilities = {
      'Rare': 0.98, // 70% chance
      'Super Rare': 0.19, // 20% chance
      'Ultra Rare': 0.01 // 10% chance
    };
    this.items = {
        "Ultra Rare": [
          { name: "Dragon Weapon (Lv. 3) Exchange Ticket", quantity: 1 },
          { name: "Wings of Splendor - Lv. 10 PVP/PVE", quantity: 1 },
          { name: "Dragon Weapon (Lv. 2) Exchange Ticket", quantity: 1 },
          { name: "God's Accessory Lv. 6 Exchange Ticket", quantity: 1 },
          { name: "Greater Fire Dragon Agathion Charm", quantity: 1 },
          { name: "Top-grade Gem Lv. 10 Exchange Ticket", quantity: 1 },
          { name: "Shilen's Soul Crystal - Lv. 10 - Weapon", quantity: 1 },
          { name: "Masia's Soul Crystal - Lv. 10 - Accessory", quantity: 1 },
          { name: "Pa'agrio's Soul Crystal - Lv. 10 - Armor", quantity: 1 },
          { name: "Eva's Soul Crystal - Lv. 10 - Accessory", quantity: 1 },
          { name: "+8 Dragon Accessory Crafting Ticket", quantity: 1 },
          { name: "Blood-stained Zariche Exchange Ticket", quantity: 1 },
          { name: "Blood-stained Akamanah Exchange Ticket", quantity: 1 },
          { name: "+32 Limited Weapon Exchange Ticket", quantity: 1 },
          { name: "+20 Limited Leviathan Heavy Armor Set", quantity: 1 },
          { name: "+20 Limited Leviathan Light Armor Set", quantity: 1 },
          { name: "+20 Limited Leviathan Robe Set", quantity: 1 },
          { name: "Ruler's Authority - Chaos Lv. 3", quantity: 1 },
          { name: "Legendary Dye Lv. 10 Exchange Ticket", quantity: 1 }
        ].reverse(),
        "Super Rare": [
          { name: "Epic Talisman", quantity: 1 },
          { name: "Greater Rune Stone", quantity: 1 },
          { name: "+5 Super Advanced Seed Bracelet Lv. 4 Pack", quantity: 1 },
          { name: "+5 Top-grade Artifact Book Pack", quantity: 1 },
          { name: "+5 Top-grade Kaliel’s Bracelet Pack", quantity: 1 },
          { name: "Dragon Claw", quantity: 1 },
          { name: "Dark Augment Stone", quantity: 1 },
          { name: "Zariche's Blood", quantity: 1 },
          { name: "Akamanah's Blood", quantity: 1 },
          { name: "Talisman - Seven Signs", quantity: 1 },
          { name: "Shining Energy of Protection", quantity: 1 },
          { name: "Shiny Gem Energy", quantity: 1 },
          { name: "Shining Sayha's Energy", quantity: 1 },
          { name: "Authority Ornament", quantity: 1 },
          { name: "Holy Greater Zodiac Agathion Book of Growth", quantity: 1 }
        ].reverse(),
        "Rare": [
          { name: "Forgotten Spellbook Chapter 1", quantity: 3 },
          { name: "Crystal of Dawn", quantity: 3 },
          { name: "Cloak Augment Stone - Ancient Kingdom", quantity: 3 },
          { name: "Cloak Augment Stone - Elmore", quantity: 3 },
          { name: "Deton's Purple Potion", quantity: 3 },
          { name: "Freya's Scroll of Storm", quantity: 20 },
          { name: "Freya's Ice Rose", quantity: 20 },
          { name: "Honey Dark Beer", quantity: 20 },
          { name: "Glowing Dragon's Attribute Potion EXP", quantity: 20 },
          { name: "Shining Nevit's Gold Sandglass", quantity: 20 },
          { name: "Mimi's Potion", quantity: 20 },
          { name: "Nana's Potion", quantity: 20 },
          { name: "Shining Einhasad's Historical Tome", quantity: 20 }
        ].reverse()
    };
  }

  setBalance(balance) {
    this.balance = balance
  }

  openBox() {
    if(this.balance < 40 ) {
      const label = document.getElementById('label')
      label.innerHTML = "No more Coins"
      return null
    }
    this.openingCount++;
    let category;
    if (this.openingCount % 150 === 0) {
      // Guaranteed SR or UR
      category = Math.random() < 0.5 ? 'Super Rare' : 'Ultra Rare';
    } else {
      // Select category based on probabilities
      category = this.selectCategory();
    }
    
    // Select an item from the chosen category
    const item = this.selectItemFromCategory(category);
    console.log(`Opening #${this.openingCount}: ${category} - ${item.name}`);
    return {category, item};
  }

  selectCategory() {
    const rand = Math.random();
    let cumulativeProbability = 0;
    for (const [category, probability] of Object.entries(this.categoryProbabilities)) {
      cumulativeProbability += probability;
      if (rand < cumulativeProbability) {
        return category;
      }
    }
  }

  selectItemFromCategory(category) {
    const itemsInCategory = this.items[category];
    const randomIndex = Math.floor(Math.random() * itemsInCategory.length);
    return itemsInCategory[randomIndex];
  }
}


// Example usage
const lootBoxSystem = new LootBoxSystem();
const openedBoxes = []
const ultraRareBoxes = []

window.addEventListener("DOMContentLoaded", () => {
  const balance = document.getElementById('balance')
  balance.innerHTML = lootBoxSystem.balance
})

const onOpen = (inBulk=false) => {
  const {category, item} = lootBoxSystem.openBox();
  const label = document.getElementById('label')
  const lastCategory = document.getElementById('lastCategory')
  if(!inBulk){
    lootBoxSystem.balance -= 40
  }
  const balance = document.getElementById('balance')
  balance.innerHTML = lootBoxSystem.balance
  label.innerHTML = `${category} - ${item.name}`
  lastCategory.innerHTML = `#: ${category}`
  if(category === 'Ultra Rare') {
    ultraRareBoxes.push({category, name: item.name})
  }
  openedBoxes.push({category, name: item.name})
  drawBoxes()
}

const onOpenByEleven = () => {
  if (lootBoxSystem.balance >= 400) {
    lootBoxSystem.balance -= 400
    const balance = document.getElementById('balance')
    balance.innerHTML = lootBoxSystem.balance
    Array(11).fill(null).map(() => onOpen(true))
  } else {
    const label = document.getElementById('label')
    label.innerHTML = "Not enough coins to open in bulk"
    return null
  }
}

const drawBoxes = () => {
  const rlist = document.getElementById('rlist')
  const urlist = document.getElementById('urlist')

  rlist.innerHTML = openedBoxes.reverse().map(({category, name}) => category === 'Ultra Rare' 
    ? `<li><b>${category} - ${name}</b></li>` 
    : `<li>${category} - ${name}</li>`).join('')
  urlist.innerHTML = ultraRareBoxes.length === 0 
  ? `<li>---</li>`
  : ultraRareBoxes.map(({category, name}) => `<li>${category} - ${name}</li>`).join('')

}

const setBalance = () => {
  const input = document.getElementsByName('balance')[0]
  if(!input.value) return
  if(lootBoxSystem.balance < 0) {
    lootBoxSystem.balance = 0;
  }
  lootBoxSystem.setBalance(+input.value + lootBoxSystem.balance )
  const balance = document.getElementById('balance')
  balance.innerHTML = lootBoxSystem.balance
}
lootBoxSystem.openBox()