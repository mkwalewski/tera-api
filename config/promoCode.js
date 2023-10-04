"use strict";

const Shop = require("../src/actions/handlers/shop");
const Benefit = require("../src/actions/handlers/benefit");
const ItemClaim = require("../src/actions/handlers/itemClaim");

// Default benefit id for Elite Status
const benefitId = process.env.API_PORTAL_BENEFIT_ID_ELITE_STATUS || 533; // RU VIP

// Box Context base settings for sending items on Promo code activation
const boxContext = {
    // Title of the box sent to the player
    title: "Promo Code Activation",

    // Message text included in the box
    content: "Your promo code activation gift!",

    // Box item icon file name (GiftBox01.bmp or GiftBox02.bmp)
    icon: "GiftBox01.bmp",

    // Period of storage of the box in days
    days: 365
};

// Class list
const WarriorId = 1;
const LancerId = 2;
const SlayerId = 3;
const BerserkerId = 4
const SorcererId = 5;
const ArcherId = 6;
const PriestId = 7;
const MysticId = 8;
const ReaperId = 9;
const GunnerId = 10;
const BrawlerId = 11;
const NinjaId = 12;
const ValkyrieId = 13;

// Lists
const AnnihilationWeaponList = [
    89512, // (Warrior) Annihilation Twin Swords
    89520, // (Lancer) Annihilation Lance
    89528, // (Slayer) Annihilation Greatsword
    89536, // (Berserker) Annihilation Axe
    89544, // (Sorcerer) Annihilation Disc
    89552, // (Archer) Annihilation Bow
    89560, // (Priest) Annihilation Staff
    89568, // (Mystic) Annihilation Scepter
    89576, // (Reaper) Annihilation Scythes
    89584, // (Gunner) Annihilation Arcannon
    89592, // (Brawler) Annihilation Powerfists
    89600, // (Ninja) Annihilation Shuriken
    89608, // (Valkyrie) Annihilation Runeglaive
];
const DarkLightWeaponList = [
    89516, // (Warrior) Dark Light Twin Swords
    89524, // (Lancer) Dark Light Lance
    89532, // (Slayer) Dark Light Greatsword
    89540, // (Berserker) Dark Light Axe
    89548, // (Sorcerer) Dark Light Disc
    89556, // (Archer) Dark Light Bow
    89564, // (Priest) Dark Light Staff
    89572, // (Mystic) Dark Light Scepter
    89580, // (Reaper) Dark Light Scythes
    89588, // (Gunner) Dark Light Arcannon
    89596, // (Brawler) Dark Light Powerfists
    89604, // (Ninja) Dark Light Shuriken
    89612, // (Valkyrie) Dark Light Runeglaive
];
const GlypxTokenList = [
    89789, // (Warrior) Federation Supply: Glyph Token
    89790, // (Lancer) Federation Supply: Glyph Token
    89791, // (Slayer) Federation Supply: Glyph Token
    89792, // (Berserker) Federation Supply: Glyph Token
    89793, // (Sorcerer) Federation Supply: Glyph Token
    89794, // (Archer) Federation Supply: Glyph Token
    89795, // (Priest) Federation Supply: Glyph Token
    89796, // (Mystic) Federation Supply: Glyph Token
    89797, // (Reaper) Federation Supply: Glyph Token
    89798, // (Gunner) Federation Supply: Glyph Token
    89799, // (Brawler) Federation Supply: Glyph Token
    89800, // (Ninja) Federation Supply: Glyph Token
    89801, // (Valkyrie) Federation Supply: Glyph Token
];
const AnnihilationWeapon = function (classId) {
    const itemId = AnnihilationWeaponList[classId - 1];
    return [ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: itemId, item_count: 1},
            ]
        }]
    }];
};
const DarkLightWeapon = function (classId) {
    const itemId = DarkLightWeaponList[classId - 1];
    return [ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: itemId, item_count: 1},
            ]
        }]
    }];
};
const GlypxToken = function (classId) {
    const itemId = GlypxTokenList[classId - 1];
    return [ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: itemId, item_count: 50},
                {item_template_id: 39832, item_count: 1}, // Apex Glyph Box
                {item_template_id: 32129, item_count: 1}, // Velika Banquet Souvenir
            ]
        }]
    }];
};
// Skills
const AdvanceSkillsBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 207616, item_count: 3}, // Lv.67 Complete Skill Optimization Book
                {item_template_id: 207620, item_count: 3}, // Lv.69 Complete Skill Optimization Book
            ]
        }]
    }
];
// Gear
const HeavyAnnihilationGearBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 89616, item_count: 1}, // Annihilation Hauberk
                {item_template_id: 89640, item_count: 1}, // Annihilation Gauntlet
                {item_template_id: 89664, item_count: 1}, // Annihilation Greaves
            ]
        }]
    }
];
const MediumAnnihilationGearBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 89624, item_count: 1}, // Annihilation Cuirass
                {item_template_id: 89648, item_count: 1}, // Annihilation Gloves
                {item_template_id: 89672, item_count: 1}, // Annihilation Boots
            ]
        }]
    }
];
const LightAnnihilationGearBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 89632, item_count: 1}, // Annihilation Robe
                {item_template_id: 89656, item_count: 1}, // Annihilation Sleeves
                {item_template_id: 89680, item_count: 1}, // Annihilation Shoes
            ]
        }]
    }
];
const HeavyDarkLightGearBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 89620, item_count: 1}, // Dark Light Hauberk
                {item_template_id: 89644, item_count: 1}, // Dark Light Gauntlet
                {item_template_id: 89668, item_count: 1}, // Dark Light Greaves
            ]
        }]
    }
];
const MediumDarkLightGearBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 89628, item_count: 1}, // Dark Light Cuirass
                {item_template_id: 89652, item_count: 1}, // Dark Light Gloves
                {item_template_id: 89676, item_count: 1}, // Dark Light Boots
            ]
        }]
    }
];
const LightDarkLightGearBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 89636, item_count: 1}, // Dark Light Robe
                {item_template_id: 89660, item_count: 1}, // Dark Light Sleeves
                {item_template_id: 89684, item_count: 1}, // Dark Light Shoes
            ]
        }]
    }
];
// Accessory
const AnnihilationAccessoryBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 88870, item_count: 1}, // Annihilation Mask
                {item_template_id: 88878, item_count: 1}, // Annihilation Brooch
                {item_template_id: 89688, item_count: 1}, // Annihilation Belt
            ]
        }]
    }
];
const DarkLightAccessoryBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 88874, item_count: 1}, // Dark Light Mask
                {item_template_id: 88882, item_count: 1}, // Dark Light Brooch
                {item_template_id: 89692, item_count: 1}, // Dark Light Belt
            ]
        }]
    }
];
const WarlordJewelryBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 89807, item_count: 1}, // Warlord's Bracing Necklace
                {item_template_id: 89808, item_count: 1}, // Warlord's Fearsome Necklace
                {item_template_id: 89805, item_count: 2}, // Warlord's Bracing Ring
                {item_template_id: 89806, item_count: 2}, // Warlord's Fearsome Ring
                {item_template_id: 89898, item_count: 2}, // Strong Warlord’s Earring
                {item_template_id: 89899, item_count: 2}, // Keen Warlord’s Earring
                {item_template_id: 89900, item_count: 1}, // Warlord’s Circlet
            ]
        }]
    }
];
// Relics
const Blue3RelicsBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 89132, item_count: 1}, // Dagon's Halidom III
                {item_template_id: 89122, item_count: 1}, // Karas's Halidom III
                {item_template_id: 89032, item_count: 1}, // Tithus's Relic III
                {item_template_id: 89022, item_count: 1}, // Elinu's Relic III
            ]
        }]
    }
];
const Blue5RelicsBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 89134, item_count: 1}, // Dagon's Halidom V
                {item_template_id: 89124, item_count: 1}, // Karas's Halidom V
                {item_template_id: 89034, item_count: 1}, // Tithus's Relic V
                {item_template_id: 89024, item_count: 1}, // Elinu's Relic V
            ]
        }]
    }
];
const Yellow3RelicsBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 89142, item_count: 1}, // Ishara's Halidom III
                {item_template_id: 89042, item_count: 1}, // Amarun's Relic III
            ]
        }]
    }
];
const Yellow5RelicsBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 89144, item_count: 1}, // Ishara's Halidom V
                {item_template_id: 89044, item_count: 1}, // Amarun's Relic V
            ]
        }]
    }
];
// Crystals
const VyrskBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 8940, item_count: 4}, // Powerful Vyrsk
                {item_template_id: 8944, item_count: 4}, // Keen Vyrsk
                {item_template_id: 8955, item_count: 4}, // Threatening Vyrsk
                {item_template_id: 8941, item_count: 4}, // Grounding Vyrsk
                {item_template_id: 8954, item_count: 4}, // Succoring Vyrsk
                {item_template_id: 8948, item_count: 4}, // Swift Vyrsk
            ]
        }]
    }
];
// Supply
const SupplyBox = [
    ItemClaim, {
        makeBox: [{
            ...boxContext, items: [
                {item_template_id: 207631, item_count: 1}, // Level 70 Scroll
                {item_template_id: 369, item_count: 10}, // Diamond
                {item_template_id: 99207, item_count: 1}, // Pocket Tab
                {item_template_id: 99205, item_count: 120}, // Pocket Tab Expansion Token
                {item_template_id: 99202, item_count: 5}, // Inventory Expansion
            ]
        }]
    }
];

// List of Promo code functions, linked with certain promo code.
// The functions specified here are automatically displayed in the Admin Panel.
module.exports = {
    // FREE-70-LVLUP
    add_item_70_scroll: [
        [ItemClaim, {
            makeBox: [{
                ...boxContext,
                // List of items in the box
                items: [
                    {item_template_id: 208040, item_count: 1}, // (208040) Kaia’s Gear Box [Weapon]
                    {item_template_id: 208041, item_count: 1}, // (208041) Kaia’s Gear Box [Body Armor]
                    {item_template_id: 208042, item_count: 1}, // (208042) Kaia’s Gear Box [Hand Armor]
                    {item_template_id: 208043, item_count: 1}, // (208043) Kaia’s Gear Box [Foot Armor]
                ]
            }]
        }]
    ],

    /**
     * Class Gear
     *
     * archer
     * berserker
     * brawler
     * gunner
     * lancer
     * mystic
     * ninja
     * priest
     * reaper
     * slayer
     * sorcerer
     * valkyrie
     * warrior
     */
    archer_gear: [
        AnnihilationWeapon(ArcherId),
        GlypxToken(ArcherId),
        AdvanceSkillsBox,
        MediumAnnihilationGearBox,
        AnnihilationAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],
    berserker_gear: [
        AnnihilationWeapon(BerserkerId),
        GlypxToken(BerserkerId),
        AdvanceSkillsBox,
        HeavyAnnihilationGearBox,
        AnnihilationAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],
    brawler_gear: [
        AnnihilationWeapon(BrawlerId),
        GlypxToken(BrawlerId),
        AdvanceSkillsBox,
        HeavyAnnihilationGearBox,
        AnnihilationAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],
    gunner_gear: [
        DarkLightWeapon(GunnerId),
        GlypxToken(GunnerId),
        AdvanceSkillsBox,
        HeavyDarkLightGearBox,
        DarkLightAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],
    lancer_gear: [
        AnnihilationWeapon(LancerId),
        GlypxToken(LancerId),
        AdvanceSkillsBox,
        HeavyAnnihilationGearBox,
        AnnihilationAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],
    mystic_gear: [
        DarkLightWeapon(MysticId),
        GlypxToken(MysticId),
        AdvanceSkillsBox,
        LightDarkLightGearBox,
        DarkLightAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],
    ninja_gear: [
        DarkLightWeapon(NinjaId),
        GlypxToken(NinjaId),
        AdvanceSkillsBox,
        LightDarkLightGearBox,
        DarkLightAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],
    priest_gear: [
        DarkLightWeapon(PriestId),
        GlypxToken(PriestId),
        AdvanceSkillsBox,
        LightDarkLightGearBox,
        DarkLightAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],
    reaper_gear: [
        DarkLightWeapon(ReaperId),
        GlypxToken(ReaperId),
        AdvanceSkillsBox,
        MediumDarkLightGearBox,
        DarkLightAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],
    slayer_gear: [
        AnnihilationWeapon(SlayerId),
        GlypxToken(SlayerId),
        AdvanceSkillsBox,
        MediumAnnihilationGearBox,
        AnnihilationAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],
    sorcerer_gear: [
        DarkLightWeapon(SorcererId),
        GlypxToken(SorcererId),
        AdvanceSkillsBox,
        LightDarkLightGearBox,
        DarkLightAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],
    valkyrie_gear: [
        AnnihilationWeapon(ValkyrieId),
        GlypxToken(ValkyrieId),
        AdvanceSkillsBox,
        MediumAnnihilationGearBox,
        AnnihilationAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],
    warrior_gear: [
        AnnihilationWeapon(WarriorId),
        GlypxToken(WarriorId),
        AdvanceSkillsBox,
        MediumAnnihilationGearBox,
        AnnihilationAccessoryBox,
        WarlordJewelryBox,
        Blue3RelicsBox,
        Yellow3RelicsBox,
        VyrskBox,
        SupplyBox
    ],

    // FREE-COINS
    fund_100_coins: [
        [Shop, {fund: [100]}]
    ],
    fund_500_coins: [
        [Shop, {fund: [500]}]
    ],
    fund_1000_coins: [
        [Shop, {fund: [1000]}]
    ],
    fund_5000_coins: [
        [Shop, {fund: [5000]}]
    ],

    // FREE-VIP
    add_benefit_vip_30: [
        [Benefit, {addBenefit: [benefitId, 30]}]
    ],
    add_benefit_vip_60: [
        [Benefit, {addBenefit: [benefitId, 60]}]
    ],
    add_benefit_vip_90: [
        [Benefit, {addBenefit: [benefitId, 90]}]
    ],
};