export default {
  "bow1": {
    "type": ["Weapons", "TwoHandWeapons", "Bow"],
    "data": {
      "verified": true,
      "w": 2,
      "h": 4,
      "icon": "https:\/\/p7p4m6s5.ssl.hwcdn.net\/image\/Art\/2DItems\/Weapons\/TwoHandWeapons\/Bows\/Bow8.png?scale=1&w=2&h=4&v=6c31d15f02f212101bb0bcdb0bbe5c863",
      "support": true,
      "league": "Talisman",
      "sockets": [
        {
          "group": 0,
          "attr": "S"
        },
        {
          "group": 0,
          "attr": "D"
        },
        {
          "group": 0,
          "attr": "S"
        },
        {
          "group": 0,
          "attr": "D"
        },
        {
          "group": 0,
          "attr": "D"
        },
        {
          "group": 0,
          "attr": "D"
        }
      ],
      "name": "",
      "typeLine": "<<set:MS>><<set:M>><<set:S>>Tempered Harbinger Bow of Piercing",
      "identified": true,
      "corrupted": false,
      "lockedToCharacter": false,
      "properties": [
        {
          "name": "Bow",
          "values": [

          ],
          "displayMode": 0
        },
        {
          "name": "Physical Damage",
          "values": [
            [
              "59-148",
              1
            ]
          ],
          "displayMode": 0
        },
        {
          "name": "Critical Strike Chance",
          "values": [
            [
              "8.55%",
              1
            ]
          ],
          "displayMode": 0
        },
        {
          "name": "Attacks per Second",
          "values": [
            [
              "1.20",
              0
            ]
          ],
          "displayMode": 0
        }
      ],
      "requirements": [
        {
          "name": "Level",
          "values": [
            [
              "68",
              0
            ]
          ],
          "displayMode": 0
        },
        {
          "name": "Dex",
          "values": [
            [
              "212",
              0
            ]
          ],
          "displayMode": 1
        }
      ],
      "talismanTier": 0,
      "implicitMods": [
        "49% increased Critical Strike Chance"
      ],
      "explicitMods": [
        "Adds 24-57 Physical Damage",
        "22% increased Critical Strike Chance"
      ],
      "frameType": 1,
      "socketedItems": [

      ]
    }
  },
  "armour1": {
    "type": ["Armours"],
    "data": {
      "explicitMods": [
        "+28 to Strength",
        "13% increased Armour",
        "7% increased Stun Recovery"
      ]
    }
  },
  "amu1": {
    type: ["Amulets"],
    data: {
      explicitMods: `Adds 9-15 Physical Damage to Attacks
+25 to Strength
21% increased Global Critical Strike Chance
+3 Life gained for each Enemy hit by your Attacks`.split('\n'),
    }
  },
  "amu2": {
    type: ["Amulets"],
    data: {
      explicitMods: `27% increased Global Critical Strike Chance
+89 to maximum Life
+14 to maximum Energy Shield
+41% to Cold Resistance
+45% to Lightning Resistance`.split('\n'),
    }
  },
}
