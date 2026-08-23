// Maps a drop's item name (as it appears in BOSS_DATA.json) to an icon in
// public/items-icons/. Only a handful of items have art so far — anything
// missing here just falls back to a placeholder in the UI.
//
// Icon paths follow /items-icons/<category>/<grade>/<file>.png, e.g.
// weapon/D/weapon_saber_i00.png — <grade> is omitted for ungraded items
// (craft materials, the resurrection scroll). Category and grade below are
// both derived from this path, so it's the single source of truth — no
// separate metadata map to keep in sync with it.
export const itemIcons: Record<string, string> = {
  Saber: "/items-icons/weapon/D/weapon_saber_i00.png",
  "Heavy Sword": "/items-icons/weapon/D/weapon_heavy_sword_i00.png",
  "Heavy Sword Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Saber Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Puma Skin Gaiters": "/items-icons/armour/D/armor_puma_skin_gaiters_i00.png",
  "Puma Skin Shirt": "/items-icons/armour/D/armor_puma_skin_shirt_i00.png",
  "Cursed Tunic": "/items-icons/armour/D/armor_t14_u_i00.png",
  "Cursed Stockings": "/items-icons/armour/D/armor_t14_l_i00.png",
  "Bagh-Nakh": "/items-icons/weapon/D/weapon_baghnakh_i00.png",
  "Scroll: Enchant Weapon (D)":
    "/items-icons/scrolls/D/etc_scroll_of_enchant_weapon_i01.png",
  "Scroll: Enchant Armor (D)":
    "/items-icons/scrolls/D/etc_scroll_of_enchant_armor_i01.png",
  "Blessed Scroll: Enchant Weapon (D)":
    "/items-icons/scrolls/D/etc_blessed_scrl_of_ench_wp_d_i01.png",
  "Blessed Scroll: Enchant Armor (D)":
    "/items-icons/scrolls/D/etc_blessed_scrl_of_ench_am_d_i01.png",
  "Blessed Scroll of Resurrection for Pets":
    "/items-icons/scrolls/etc_scroll_of_resurrection_pet_i01.png",
  "Bone Staff": "/items-icons/weapon/D/weapon_apprentices_staff_i00.png",
  "Hand Axe": "/items-icons/weapon/D/weapon_hand_axe_i00.png",
  "Iron Plate Gaiters": "/items-icons/armour/D/armor_t12_l_i00.png",
  "Ring Mail Breastplate": "/items-icons/armour/D/armor_t12_u_i00.png",
  Scalpel: "/items-icons/weapon/D/weapon_scalpel_i00.png",
  "Lion Skin Shirt": "/items-icons/armour/D/armor_t18_u_i00.png",
  "Lion Skin Gaiters": "/items-icons/armour/D/armor_t18_l_i00.png",
  Pike: "/items-icons/weapon/D/weapon_pike_i00.png",
  "Bronze Helmet": "/items-icons/armour/D/armor_helmet_i00.png",
  Aspis: "/items-icons/armour/D/shield_aspis_i00.png",
  "Divine Tome": "/items-icons/weapon/D/weapon_divine_tome_i00.png",
  "Enchanted Earring": "/items-icons/accessary/accessary_enchanted_earing_i00.png",
  "Enchanted Ring": "/items-icons/accessary/accessary_enchanted_ring_i00.png",
  "Enchanted Necklace":
    "/items-icons/accessary/accessary_enchanted_necklace_i00.png",
  "Enchanted Necklace Chain": "/items-icons/craft/etc_jewel_box_i00.png",
  "Long Bow": "/items-icons/weapon/D/weapon_long_bow_i00.png",
  "Elven Bow": "/items-icons/weapon/D/weapon_elven_bow_i00.png",
  "Elven Bow Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Leather Gauntlets": "/items-icons/armour/D/armor_t18_g_i00.png",
  "Blue Buckskin Boots": "/items-icons/armour/D/armor_t18_b_i00.png",
  "Poniard Dagger": "/items-icons/weapon/D/weapon_dirk_i00.png",
  "Scale Mail": "/items-icons/armour/D/armor_t08_u_i00.png",
  "Scale Gaiters": "/items-icons/armour/D/armor_t08_l_i00.png",
  "Scale Mail Fragment": "/items-icons/craft/etc_plate_silver_i00.png",
  "Scale Gaiters Fragment": "/items-icons/craft/etc_plate_silver_i00.png",
  "Bastard Sword": "/items-icons/weapon/D/weapon_bastard_sword_i00.png",
  "Spinebone Sword": "/items-icons/weapon/D/weapon_spinebone_sword_i00.png",
  "Artisan's Sword": "/items-icons/weapon/D/weapon_artisans_sword_i00.png",
  "Knight's Sword": "/items-icons/weapon/D/weapon_knights_sword_i00.png",
  "Spinebone Sword Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Elven Tunic": "/items-icons/armour/D/armor_t11_u_i00.png",
  "White Tunic": "/items-icons/armour/D/armor_t16_u_i00.png",
  "Mystic's Tunic": "/items-icons/armour/D/armor_t17_u_i00.png",
  "Elven Stockings": "/items-icons/armour/D/armor_t11_l_i00.png",
  "Dark Stockings": "/items-icons/armour/D/armor_t16_l_i00.png",
  "Mystic's Stockings": "/items-icons/armour/D/armor_t17_l_i00.png",
  "White Tunic Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Dark Stocking Fabric":
    "/items-icons/craft/etc_piece_of_cloth_white_i00.png",
  Tomahawk: "/items-icons/weapon/D/weapon_tomahawk_i00.png",
  "Mace of Prayer": "/items-icons/weapon/D/weapon_mace_of_prayer_i00.png",
  "Mace of Judgment": "/items-icons/weapon/D/weapon_mace_of_judgment_i00.png",
  "Mace of Miracle": "/items-icons/weapon/D/weapon_mace_of_miracle_i00.png",
  "Doom Hammer": "/items-icons/weapon/D/weapon_doom_hammer_i00.png",
  "Mystic Staff": "/items-icons/weapon/D/weapon_mystic_staff_i00.png",
  "Conjuror's Staff": "/items-icons/weapon/D/weapon_conjure_staff_i00.png",
  "Staff of Mana": "/items-icons/weapon/D/weapon_staff_of_mana_i00.png",
  "Mace of Judgment Head": "/items-icons/craft/etc_squares_silver_i00.png",
  "Conjuror's Staff Head": "/items-icons/craft/etc_squares_gray_i00.png",
  Helmet: "/items-icons/armour/D/armor_helmet_i00.png",
  Hoplon: "/items-icons/armour/D/shield_hoplon_i00.png",
  Gastraphetes: "/items-icons/weapon/D/weapon_gastraphetes_i00.png",
  "Gastraphetes Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Tiger's Eye Earring":
    "/items-icons/accessary/accessary_tigerseye_earing_i00.png",
  "Black Pearl Ring":
    "/items-icons/accessary/accessary_black_pearl_ring_i00.png",
  "Near Forest Necklace":
    "/items-icons/accessary/accessary_near_forest_necklace_i00.png",
  "Tiger's Eye Earring Stone": "/items-icons/craft/etc_jewel_gold_i00.png",
  "Spiked Club": "/items-icons/weapon/D/weapon_spike_club_i00.png",
  "Staff of Magic":
    "/items-icons/weapon/D/weapon_staff_of_magicpower_i00.png",
  "Spiked Club Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Mithril Banded Mail":
    "/items-icons/armour/D/armor_mithril_banded_mail_i00.png",
  "Reinforced Leather Shirt": "/items-icons/armour/D/armor_t13_u_i00.png",
  "Mithril Banded Gaiters": "/items-icons/armour/D/armor_t10_l_i00.png",
  "Reinforced Leather Gaiters": "/items-icons/armour/D/armor_t13_l_i00.png",
  Kukuri: "/items-icons/weapon/D/weapon_kukuri_i00.png",
  "Dagger of Mana": "/items-icons/weapon/D/weapon_dagger_of_mana_i00.png",
  "Mystic Knife": "/items-icons/weapon/D/weapon_mystic_knife_i00.png",
  "Shilen Knife": "/items-icons/weapon/D/weapon_knife_o'_silenus_i00.png",
  "Mithril Banded Mail Material":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Mithril Banded Gaiters Material":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Shilen Knife Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Tome of Blood": "/items-icons/weapon/D/weapon_tome_of_blood_i00.png",
  "Sage's Blood": "/items-icons/weapon/D/weapon_blood_of_saints_i00.png",
  "Tome of Blood Page":
    "/items-icons/craft/etc_piece_of_paper_gray_i00.png",
  "Blast Plate": "/items-icons/armour/D/armor_t40_u_i00.png",
  "Mithril Breastplate": "/items-icons/armour/D/armor_t19_u_i00.png",
  "Compound Scale Mail": "/items-icons/armour/D/armor_t20_u_i00.png",
  "Dwarven Scale Mail": "/items-icons/armour/D/armor_t15_u_i00.png",
  "Mithril Gaiters": "/items-icons/armour/D/armor_t19_l_i00.png",
  "Compound Scale Gaiters": "/items-icons/armour/D/armor_t20_l_i00.png",
  "Dwarven Scale Gaiters": "/items-icons/armour/D/armor_t15_l_i00.png",
  "War Hammer": "/items-icons/weapon/D/weapon_war_hammer_i00.png",
  "Dwarven Pike": "/items-icons/weapon/D/weapon_dwarven_pike_i00.png",
  Gauntlets: "/items-icons/armour/D/armor_t10_g_i00.png",
  "Iron Boots": "/items-icons/armour/D/armor_t10_b_i00.png",
  "Reinforced Leather Boots": "/items-icons/armour/D/armor_t13_b_i00.png",
  "Boots of Knowledge": "/items-icons/armour/D/armor_t41_b_i00.png",
  "Reinforced Leather Gloves": "/items-icons/armour/D/armor_t13_g_i00.png",
  "Gloves of Knowledge": "/items-icons/armour/D/armor_t41_g_i00.png",
  "Iron Boots Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Triple-Edged Jamadhr":
    "/items-icons/weapon/D/weapon_triple-edged_jamadhr_i00.png",
  "Tunic of Knowledge": "/items-icons/armour/D/armor_t41_u_i00.png",
  "Stockings of Knowledge": "/items-icons/armour/D/armor_t41_l_i00.png",
  "Sword of Magic": "/items-icons/weapon/D/weapon_sword_of_magic_i00.png",
  "Sword of Occult": "/items-icons/weapon/D/weapon_sword_of_occult_i00.png",
  "Two-Handed Sword":
    "/items-icons/weapon/D/weapon_two_handed_sword_i00.png",
  "Crimson Sword": "/items-icons/weapon/D/weapon_crimson_sword_i00.png",
  "Elven Sword": "/items-icons/weapon/D/weapon_elven_sword_i00.png",
  "Two-Handed Sword Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Manticore Skin Shirt": "/items-icons/armour/D/armor_t42_u_i00.png",
  "Manticore Skin Gaiters": "/items-icons/armour/D/armor_t42_l_i00.png",
  "Manticore Skin Shirt Texture": "/items-icons/craft/etc_leather_gray_i00.png",
  "Manticore Skin Gaiters Pattern": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Strengthened Long Bow":
    "/items-icons/weapon/D/weapon_strengthening_long_bow_i00.png",
  "Strengthened Long Bow Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Single-Edged Jamadhr":
    "/items-icons/weapon/D/weapon_single-edged_jamadhr_i00.png",
  "Brigandine Tunic": "/items-icons/armour/D/armor_t43_u_i00.png",
  "Mithril Scale Gaiters": "/items-icons/armour/D/armor_t40_l_i00.png",
  "Brigandine Gaiters": "/items-icons/armour/D/armor_t43_l_i00.png",
  "Brigandine Temper": "/items-icons/craft/etc_plate_glay_i00.png",
  "Mithril Scale Gaiters Material":
    "/items-icons/craft/etc_plate_silver_i00.png",
  "Brigandine Gaiters Material":
    "/items-icons/craft/etc_plate_silver_i00.png",
  Maingauche: "/items-icons/weapon/D/weapon_maingauche_i00.png",
  "Cursed Maingauche": "/items-icons/weapon/D/weapon_maingauche_i01.png",
  "Maingauche Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Cursed Maingauche Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Mithril Tunic": "/items-icons/armour/D/armor_t51_u_i00.png",
  "Mithril Stockings": "/items-icons/armour/D/armor_t51_l_i00.png",
  "Mithril Tunic Fabric":
    "/items-icons/craft/etc_piece_of_cloth_white_i00.png",
  "Mithril Stocking Design": "/items-icons/craft/etc_leather_gray_i00.png",
  "Crucifix of Blood":
    "/items-icons/weapon/D/weapon_crucifix_of_blood_i00.png",
  "Crucifix of Blood Piece": "/items-icons/craft/etc_squares_gray_i00.png",
  "Elven Earring": "/items-icons/accessary/accessary_elven_earing_i00.png",
  "Elven Ring": "/items-icons/accessary/accessary_elven_ring_i00.png",
  "Elven Necklace": "/items-icons/accessary/accessary_elven_necklace_i00.png",
  "Elven Earring Beads": "/items-icons/craft/etc_crystal_ball_green_i00.png",
  "Elven Ring Piece": "/items-icons/craft/etc_jewel_box_i00.png",
  "Elven Necklace Beads": "/items-icons/craft/etc_crystal_ball_green_i00.png",
  "Winged Spear": "/items-icons/weapon/D/weapon_winged_spear_i00.png",
  "War Pick": "/items-icons/weapon/D/weapon_hammer_in_flames_i00.png",
  "Winged Spear Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "War Pick Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Kite Shield": "/items-icons/armour/D/shield_kite_shield_i00.png",
  "Brigandine Helmet": "/items-icons/armour/D/armor_leather_helmet_i00.png",
  "Brigandine Shield": "/items-icons/armour/D/shield_brigandine_shield_i00.png",
  "Kite Shield Fragment": "/items-icons/craft/etc_plate_silver_i00.png",
  "Brigandine Helmet Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Brigandine Shield Fragment": "/items-icons/craft/etc_plate_silver_i00.png",
  "Morning Star": "/items-icons/weapon/D/weapon_morning_star_i00.png",
  "Goat Head Staff": "/items-icons/weapon/D/weapon_goathead_staff_i00.png",
  Tarbar: "/items-icons/weapon/D/weapon_tarbar_i00.png",
  "Skull Breaker": "/items-icons/weapon/D/weapon_skull_breaker_i00.png",
  "Heavy Bone Club": "/items-icons/weapon/D/weapon_heavy_bone_club_i00.png",
  "Morning Star Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Goat Head Staff Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Tarbar Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Skull Breaker Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Heavy Bone Club Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Greater Dye of CON": "/items-icons/consumable/dyes/etc_con_hena_i02.png",
  "Greater Dye of CON <Con+1 Str-1>":
    "/items-icons/consumable/dyes/etc_con_hena_i02.png",
  "Greater Dye of CON <Con+1 Dex-1>":
    "/items-icons/consumable/dyes/etc_con_hena_i02.png",
  "Greater Dye of DEX": "/items-icons/consumable/dyes/etc_dex_hena_i02.png",
  "Greater Dye of DEX <Dex+1 Str-1>":
    "/items-icons/consumable/dyes/etc_dex_hena_i02.png",
  "Greater Dye of DEX <Dex+1 Con-1>":
    "/items-icons/consumable/dyes/etc_dex_hena_i02.png",
  "Greater Dye of STR": "/items-icons/consumable/dyes/etc_str_hena_i02.png",
  "Greater Dye of STR <Str+1 Con-1>":
    "/items-icons/consumable/dyes/etc_str_hena_i02.png",
  "Greater Dye of STR <Str+1 Dex-1>":
    "/items-icons/consumable/dyes/etc_str_hena_i02.png",
  "Greater Dye of INT <Int+1 Men-1>":
    "/items-icons/consumable/dyes/etc_int_hena_i02.png",
  "Greater Dye of INT <Int+1 Wit-1>":
    "/items-icons/consumable/dyes/etc_int_hena_i02.png",
  "Greater Dye of Men <Men+1 Int-1>":
    "/items-icons/consumable/dyes/etc_men_hena_i02.png",
  "Greater Dye of Men <Men+1 Wit-1>":
    "/items-icons/consumable/dyes/etc_men_hena_i02.png",
  "Greater Dye of WIT <Wit+1 Int-1>":
    "/items-icons/consumable/dyes/etc_wit_hena_i02.png",
  "Greater Dye of WIT <Wit+1 Men-1>":
    "/items-icons/consumable/dyes/etc_wit_hena_i02.png",
  "Bich'Hwa": "/items-icons/weapon/D/weapon_bichhwa_i00.png",
  "Bich'Hwa Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Rip Gauntlets": "/items-icons/armour/D/armor_t40_g_i00.png",
  "Boots of Power": "/items-icons/armour/D/armor_t40_b_i00.png",
  "Manticore Skin Boots": "/items-icons/armour/D/armor_t42_b_i00.png",
  "Brigandine Boots": "/items-icons/armour/D/armor_t43_b_i00.png",
  "Elven Mithril Boots": "/items-icons/armour/D/armor_t51_b_i00.png",
  "Manticore Skin Gloves": "/items-icons/armour/D/armor_t42_g_i00.png",
  "Brigandine Gauntlets": "/items-icons/armour/D/armor_t43_g_i00.png",
  "Elven Mithril Gloves": "/items-icons/armour/D/armor_t51_g_i00.png",
  "Rip Gauntlets Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Boots of Power Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Manticore Skin Boot Lining": "/items-icons/craft/etc_leather_gray_i00.png",
  "Brigandine Boots Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Elven Mithril Boots Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Manticore Skin Gloves Lining":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Brigandine Gauntlets Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Elven Mithril Gloves Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sword of Revolution":
    "/items-icons/weapon/D/weapon_sword_of_revolution_i00.png",
  "Sword of Revolution Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Square Shield": "/items-icons/armour/D/shield_square_shield_i00.png",
  "Plate Helmet": "/items-icons/armour/D/armor_leather_helmet_i00.png",
  "Plate Shield": "/items-icons/armour/D/shield_plate_shield_i00.png",
  "Square Shield Fragment": "/items-icons/craft/etc_plate_silver_i00.png",
  "Plate Helmet Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Plate Shield Fragment": "/items-icons/craft/etc_plate_silver_i00.png",
  Claymore: "/items-icons/weapon/D/weapon_claymore_i00.png",
  "Elven Long Sword": "/items-icons/weapon/D/weapon_elven_long_sword_i00.png",
  "Claymore Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Elven Long Sword Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Blessed Scroll: Enchant Weapon (C)":
    "/items-icons/scrolls/C/etc_blessed_scrl_of_ench_wp_c_i02.png",
  "Blessed Scroll: Enchant Armor (C)":
    "/items-icons/scrolls/C/etc_blessed_scrl_of_ench_am_c_i02.png",
  "Mithril Gloves": "/items-icons/armour/D/armor_t46_g_i00.png",
  "Ogre Power Gauntlets": "/items-icons/armour/D/armor_t45_g_i00.png",
  "Assault Boots": "/items-icons/armour/D/armor_t44_b_i00.png",
  "Salamander Skin Boots": "/items-icons/armour/D/armor_t45_b_i00.png",
  "Plate Boots": "/items-icons/armour/D/armor_t46_b_i00.png",
  "Sage's Worn Gloves": "/items-icons/armour/D/armor_t44_g_i00.png",
  "Mithril Gloves Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Ogre Power Gauntlets Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Assault Boots Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Salamander Skin Boot Lining":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Plate Boots Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sage's Worn Gloves Lining": "/items-icons/craft/etc_leather_gray_i00.png",
  Glaive: "/items-icons/weapon/D/weapon_glaive_i00.png",
  "Glaive Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Scroll: Enchant Weapon (C)":
    "/items-icons/scrolls/C/etc_scroll_of_enchant_weapon_i02.png",
  "Scroll: Enchant Armor (C)":
    "/items-icons/scrolls/C/etc_scroll_of_enchant_armor_i02.png",
  "Omen Beast's Eye Earring":
    "/items-icons/accessary/accessary_onyxbeastseye_earing_i00.png",
  "Mithril Ring": "/items-icons/accessary/accessary_mithril_ring_i00.png",
  "Necklace of Darkness":
    "/items-icons/accessary/accessary_necklace_of_darkness_i00.png",
  "Omen Beast's Eye Earring Gemstone":
    "/items-icons/craft/etc_bead_silver_i00.png",
  "Mithril Ring Wire": "/items-icons/craft/etc_jewel_box_i00.png",
  "Necklace of Darkness Gem": "/items-icons/craft/etc_gem_black_i00.png",
  Bonebreaker: "/items-icons/weapon/D/weapon_bonebreaker_i00.png",
  "Atuba Hammer": "/items-icons/weapon/D/weapon_atuba_hammer_i00.png",
  "Ghost Staff": "/items-icons/weapon/D/weapon_ghost_staff_i00.png",
  "Staff of Life": "/items-icons/weapon/D/weapon_life_stick_i00.png",
  "Atuba Mace": "/items-icons/weapon/D/weapon_atuba_mace_i00.png",
  "Bonebreaker Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Atuba Hammer Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Ghost Staff Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Staff of Life Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Atuba Mace Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Salamander Skin Mail": "/items-icons/armour/D/armor_t45_ul_i00.png",
  "Salamander Skin Mail Texture":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Sage's Rag": "/items-icons/armour/D/armor_t44_ul_i00.png",
  "Sage's Rag Lining": "/items-icons/craft/etc_leather_gray_i00.png",
  "Light Crossbow": "/items-icons/weapon/D/weapon_cyclone_bow_i00.png",
  "Light Crossbow Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Mithril Dagger": "/items-icons/weapon/D/weapon_mithril_dagger_i00.png",
  "Mithril Dagger Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Half Plate Armor": "/items-icons/armour/D/armor_t46_u_i00.png",
  "Plate Gaiters": "/items-icons/armour/D/armor_t46_l_i00.png",
  "Half Plate Temper": "/items-icons/craft/etc_plate_glay_i00.png",
  "Plate Gaiters Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Scallop Jamadhr":
    "/items-icons/weapon/D/weapon_scallop_jamadhr_i00.png",
  "Scallop Jamadhr Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Greater Dye of DEX <Dex+2 Con-2>":
    "/items-icons/consumable/dyes/etc_dex_hena_i02.png",
  "Greater Dye of INT <Int+2 Men-2>":
    "/items-icons/consumable/dyes/etc_int_hena_i02.png",
  "Greater Dye of INT <Int+2 Wit-2>":
    "/items-icons/consumable/dyes/etc_int_hena_i02.png",
  "Mithril Shirt":
    "/items-icons/armour/C/armor_tempered_mithril_shirt_i00.png",
  "Tempered Mithril Gaiters":
    "/items-icons/armour/C/armor_tempered_mithril_gaiters_i00.png",
  "Mithril Shirt Fabric":
    "/items-icons/craft/etc_piece_of_cloth_white_i00.png",
  "Tempered Mithril Gaiters Fragment":
    "/items-icons/craft/etc_plate_silver_i00.png",
  "Greater Dye of CON <Con+2 Str-2>":
    "/items-icons/consumable/dyes/etc_con_hena_i02.png",
  "Greater Dye of CON <Con+2 Dex-2>":
    "/items-icons/consumable/dyes/etc_con_hena_i02.png",
  "Greater Dye of DEX <Dex+2 Str-2>":
    "/items-icons/consumable/dyes/etc_dex_hena_i02.png",
  "Greater Dye of STR <Str+2 Con-2>":
    "/items-icons/consumable/dyes/etc_str_hena_i02.png",
  "Greater Dye of STR <Str+2 Dex-2>":
    "/items-icons/consumable/dyes/etc_str_hena_i02.png",
  "Greater Dye of WIT <Wit+2 Men-2>":
    "/items-icons/consumable/dyes/etc_wit_hena_i02.png",
  "Greater Dye of Men <Men+2 Int-2>":
    "/items-icons/consumable/dyes/etc_men_hena_i02.png",
  "Greater Dye of Men <Men+2 Wit-2>":
    "/items-icons/consumable/dyes/etc_men_hena_i02.png",
  "Greater Dye of WIT <Wit+2 Int-2>":
    "/items-icons/consumable/dyes/etc_wit_hena_i02.png",
  "Crystallized Ice Bow":
    "/items-icons/weapon/C/weapon_crystallized_ice_bow_i00.png",
  "Crystallized Ice Bow Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  Eldarake: "/items-icons/armour/C/shield_eldarake_i00.png",
  "Chain Hood": "/items-icons/armour/D/armor_leather_helmet_i00.png",
  "Chain Shield": "/items-icons/armour/C/shield_chain_shield_i00.png",
  "Eldarake Temper": "/items-icons/craft/etc_plate_glay_i00.png",
  "Chain Hood Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Chain Shield Fragment": "/items-icons/craft/etc_plate_silver_i00.png",
  "Cursed Dagger": "/items-icons/weapon/C/weapon_cursed_dagger_i00.png",
  "Dark Elven Dagger":
    "/items-icons/weapon/C/weapon_darkelven_dagger_i00.png",
  "Cursed Dagger Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Dark Elven Dagger Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Chain Mail Shirt": "/items-icons/armour/C/armor_t48_u_i00.png",
  "Chain Gaiters": "/items-icons/armour/C/armor_t48_l_i00.png",
  "Chain Mail Shirt Material":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Chain Gaiters Part": "/items-icons/craft/etc_plate_silver_i00.png",
  Scythe: "/items-icons/weapon/C/weapon_scythe_i00.png",
  "Orcish Glaive": "/items-icons/weapon/C/weapon_orcish_glaive_i00.png",
  "Body Slasher": "/items-icons/weapon/C/weapon_body_slasher_i00.png",
  "Scythe Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Orcish Glaive Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Body Slasher Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Karmian Tunic": "/items-icons/armour/C/armor_karmian_tunic_i00.png",
  "Karmian Stockings": "/items-icons/armour/C/armor_t53_l_i00.png",
  "Karmian Tunic Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Karmian Stocking Design": "/items-icons/craft/etc_letter_red_i00.png",
  Flamberge: "/items-icons/weapon/C/weapon_flamberge_i00.png",
  Stormbringer: "/items-icons/weapon/C/weapon_stormbringer_i00.png",
  "Flamberge Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Stormbringer Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Mithril Boots": "/items-icons/armour/C/armor_t47_b_i00.png",
  "Chain Boots": "/items-icons/armour/C/armor_t48_b_i00.png",
  "Karmian Boots": "/items-icons/armour/C/armor_karmian_boots_i00.png",
  "Plated Leather Boots": "/items-icons/armour/C/armor_t47_b_i00.png",
  "Dwarven Chain Boots": "/items-icons/armour/C/armor_t60_b_i00.png",
  "Boots of Seal": "/items-icons/armour/D/armor_t44_b_i00.png",
  "Reinforced Mithril Gloves": "/items-icons/armour/C/armor_t47_g_i00.png",
  "Chain Gloves": "/items-icons/armour/C/armor_t48_g_i00.png",
  "Karmian Gloves": "/items-icons/armour/C/armor_karmian_gloves_i00.png",
  "Mithril Boots Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Chain Boots Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Karmian Boots Fabric": "/items-icons/craft/etc_leather_gray_i00.png",
  "Plate Leather Boot Lining":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Dwarven Chain Boots Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Boots of Seal Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Reinforced Mithril Gloves Design":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Chain Gloves Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Karmian Gloves Fabric": "/items-icons/craft/etc_leather_gray_i00.png",
  "Dragon Heart: C-Grade": "/items-icons/consumable/raid/etc_raid_b_i02.png",
  "Dragon Heart: B-Grade": "/items-icons/consumable/raid/etc_raid_b_i01.png",
  "Dragon Heart: A-Grade": "/items-icons/consumable/raid/etc_raid_b_i00.png",
  "False Nucleus of Life: C-Grade":
    "/items-icons/consumable/raid/etc_raid_d_i02.png",
  "False Nucleus of Life: B-Grade":
    "/items-icons/consumable/raid/etc_raid_d_i01.png",
  "False Nucleus of Life: A-Grade":
    "/items-icons/consumable/raid/etc_raid_d_i00.png",
  "Earth Egg: C-Grade": "/items-icons/consumable/raid/etc_raid_c_i02.png",
  "Earth Egg: A-Grade": "/items-icons/consumable/raid/etc_raid_c_i00.png",
  "Destruction Tombstone": "/items-icons/consumable/raid/etc_raid_f_i00.png",
  Chakram: "/items-icons/weapon/C/weapon_chakram_i00.png",
  "Chakram Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Moonstone Earring":
    "/items-icons/accessary/accessary_moonstone_earing_i00.png",
  "Aquastone Ring": "/items-icons/accessary/accessary_aquastone_ring_i00.png",
  "Aquastone Necklace":
    "/items-icons/accessary/accessary_aquastone_necklace_i00.png",
  "Moonstone Earring Wire": "/items-icons/craft/etc_jewel_box_i00.png",
  "Aquastone Ring Wire": "/items-icons/craft/etc_jewel_box_i00.png",
  "Aquastone Necklace Chain": "/items-icons/craft/etc_jewel_box_i00.png",
  "Skull of the Dead C-Grade": "/items-icons/consumable/raid/etc_raid_a_i02.png",
  "Skull of the Dead B-Grade": "/items-icons/consumable/raid/etc_raid_a_i01.png",
  "Skull of the Dead A-Grade": "/items-icons/consumable/raid/etc_raid_a_i00.png",
  "Angelic Essence: C-Grade": "/items-icons/consumable/raid/etc_raid_e_i02.png",
  "Angel's Soul: B-Grade": "/items-icons/consumable/raid/etc_raid_e_i01.png",
  "Angel's Soul: A-Grade": "/items-icons/consumable/raid/etc_raid_e_i00.png",
  "Big Hammer": "/items-icons/weapon/C/weapon_big_hammer_i00.png",
  "Battle Axe": "/items-icons/weapon/C/weapon_battle_axe_i00.png",
  "Silver Axe": "/items-icons/weapon/C/weapon_war_pick_i00.png",
  "Skull Graver": "/items-icons/weapon/C/weapon_skull_graver_i00.png",
  "Heavy Doom Hammer":
    "/items-icons/weapon/C/weapon_heavy_doom_hammer_i00.png",
  "Crystal Staff": "/items-icons/weapon/C/weapon_crystal_staff_i00.png",
  "Stick of Faith": "/items-icons/weapon/C/weapon_stick_of_faith_i00.png",
  "Heavy Doom Axe": "/items-icons/weapon/C/weapon_heavy_doom_axe_i00.png",
  "Big Hammer Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Battle Axe Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Silver Axe Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Skull Graver Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Heavy Doom Hammer Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Crystal Staff Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Stick of Faith Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Heavy Doom Axe Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Plated Leather": "/items-icons/armour/C/armor_t47_u_i00.png",
  "Plated Leather Gaiters": "/items-icons/armour/C/armor_t47_l_i00.png",
  "Rind Leather Armor": "/items-icons/armour/C/armor_t49_u_i00.png",
  "Rind Leather Gaiters": "/items-icons/armour/C/armor_t49_l_i00.png",
  "Plated Leather Fragment": "/items-icons/craft/etc_plate_silver_i00.png",
  "Plated Leather Gaiters Material":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Rind Leather Armor Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Rind Leather Gaiters Material":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Elemental Bow": "/items-icons/weapon/C/weapon_elemental_bow_i00.png",
  "Noble Elven Bow": "/items-icons/weapon/C/weapon_noble_elven_bow_i00.png",
  "Crossbow Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Elven Bow of Nobility Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Dwarven Chain Mail Shirt": "/items-icons/armour/C/armor_t60_u_i00.png",
  "Dwarven Chain Gaiters": "/items-icons/armour/C/armor_t60_l_i00.png",
  "Dwarven Chain Mail Shirt Material":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Dwarven Chain Gaiters Material":
    "/items-icons/craft/etc_leather_gray_i00.png",
  Stiletto: "/items-icons/weapon/C/weapon_stiletto_i00.png",
  "Soulfire Dirk":
    "/items-icons/weapon/C/weapon_dagger_of_magicflame_i00.png",
  "Stiletto Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Soulfire Dirk Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Robe of Seal": "/items-icons/armour/D/armor_t44_ul_i00.png",
  "Robe of Seal Fabric":
    "/items-icons/craft/etc_piece_of_cloth_white_i00.png",
  "Horn of Glory": "/items-icons/weapon/C/weapon_horn_of_glory_i00.png",
  "Horn of Glory Fragment": "/items-icons/craft/etc_claw_i00.png",
  "Greater Dye of INT <Int+3 Men-3>":
    "/items-icons/consumable/dyes/etc_int_hena_i02.png",
  "Greater Dye of INT <Int+3 Wit-3>":
    "/items-icons/consumable/dyes/etc_int_hena_i02.png",
  "Greater Dye of Men <Men+3 Int-3>":
    "/items-icons/consumable/dyes/etc_men_hena_i02.png",
  "Tower Shield": "/items-icons/armour/C/shield_tower_shield_i00.png",
  "Composite Shield": "/items-icons/armour/C/shield_composite_shield_i00.png",
  "Composite Helmet": "/items-icons/armour/D/armor_leather_helmet_i00.png",
  "Shining Circlet": "/items-icons/armour/C/armor_circlet_i00.png",
  "Tower Shield Fragment": "/items-icons/craft/etc_plate_glay_i00.png",
  "Composite Shield Fragment": "/items-icons/craft/etc_plate_silver_i00.png",
  "Composite Helmet Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Shining Circlet Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "War Axe": "/items-icons/weapon/C/weapon_war_axe_i00.png",
  "Nirvana Axe": "/items-icons/weapon/C/weapon_nirvana_axe_i00.png",
  "Stick of Eternity":
    "/items-icons/weapon/C/weapon_stick_of_eternity_i00.png",
  "Paradia Staff": "/items-icons/weapon/C/weapon_paradia_staff_i00.png",
  "Pa'agrian Hammer":
    "/items-icons/weapon/C/weapon_paagrio_hammer_i00.png",
  "Sage's Staff": "/items-icons/weapon/C/weapon_sages_staff_i00.png",
  "Club of Nature": "/items-icons/weapon/C/weapon_club_of_nature_i00.png",
  "Mace of The Underworld":
    "/items-icons/weapon/C/weapon_mace_of_underworld_i00.png",
  "War Axe Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Nirvana Axe Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Stick of Eternity Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Paradia Staff Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Pa'agrian Hammer Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Sage's Staff Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Club of Nature Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Mace of The Underworld Head":
    "/items-icons/craft/etc_squares_gray_i00.png",
  "Greater Dye of Men <Men+3 Wit-3>":
    "/items-icons/consumable/dyes/etc_men_hena_i02.png",
  "Greater Dye of WIT <Wit+3 Int-3>":
    "/items-icons/consumable/dyes/etc_wit_hena_i02.png",
  "Greater Dye of WIT <Wit+3 Men-3>":
    "/items-icons/consumable/dyes/etc_wit_hena_i02.png",
  "Composite Armor": "/items-icons/armour/C/armor_t61_ul_i00.png",
  "Fisted Blade": "/items-icons/weapon/C/weapon_fist_blade_i00.png",
  "Composite Armor Temper": "/items-icons/craft/etc_plate_glay_i00.png",
  "Fisted Blade Piece": "/items-icons/craft/etc_sword_body_i00.png",
  "Composite Boots": "/items-icons/armour/C/armor_t61_b_i00.png",
  "Mithril Gauntlets": "/items-icons/armour/C/armor_t61_g_i00.png",
  "Composite Boots Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Mithril Gauntlets Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  Caliburs: "/items-icons/weapon/C/weapon_caliburs_i00.png",
  "Sword of Delusion":
    "/items-icons/weapon/C/weapon_sword_of_delusion_i00.png",
  Tsurugi: "/items-icons/weapon/C/weapon_tsurugi_i00.png",
  "Homunkulus's Sword":
    "/items-icons/weapon/C/weapon_homunkuluss_sword_i00.png",
  "Sword of Nightmare":
    "/items-icons/weapon/C/weapon_sword_of_nightmare_i00.png",
  "Sword of Whispering Death":
    "/items-icons/weapon/C/weapon_deathbreath_sword_i00.png",
  "Caliburs Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Delusional Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Tsurugi Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Homunkulus's Sword Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Sword of Nightmare Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Sword of Whispering Death Blade":
    "/items-icons/craft/etc_sword_body_i00.png",
  "Greater Dye of CON <Con+3 Dex-3>":
    "/items-icons/consumable/dyes/etc_con_hena_i02.png",
  "Greater Dye of DEX <Dex+3 Str-3>":
    "/items-icons/consumable/dyes/etc_dex_hena_i02.png",
  "Greater Dye of DEX <Dex+3 Con-3>":
    "/items-icons/consumable/dyes/etc_dex_hena_i02.png",
  "Akat Long Bow": "/items-icons/weapon/C/weapon_akat_long_bow_i00.png",
  "Akat Longbow Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Greater Dye of STR <Str+3 Con-3>":
    "/items-icons/consumable/dyes/etc_str_hena_i02.png",
  "Greater Dye of STR <Str+3 Dex-3>":
    "/items-icons/consumable/dyes/etc_str_hena_i02.png",
  "Greater Dye of CON <Con+3 Str-3>":
    "/items-icons/consumable/dyes/etc_con_hena_i02.png",
  "Earring of Binding":
    "/items-icons/accessary/accessary_earing_of_binding_i00.png",
  "Ring of Ages": "/items-icons/accessary/accessary_ring_of_ages_i00.png",
  "Necklace of Mermaid":
    "/items-icons/accessary/accessary_necklace_of_mermaid_i00.png",
  "Earring of Binding Gemstone": "/items-icons/craft/etc_gem_clear_i00.png",
  "Ring of Ages Gemstone": "/items-icons/craft/etc_gem_clear_i00.png",
  "Necklace of Mermaid Teardrop":
    "/items-icons/craft/etc_reagent_white_i00.png",
  "Grace Dagger": "/items-icons/weapon/C/weapon_grace_dagger_i00.png",
  "Dark Screamer": "/items-icons/weapon/C/weapon_dark_screamer_i00.png",
  "Grace Dagger Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Dark Screamer Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Heathen's Book": "/items-icons/weapon/C/weapon_heathens_book_i00.png",
  "Heathen's Book Page":
    "/items-icons/craft/etc_piece_of_paper_white_i00.png",
  "Theca Leather Boots":
    "/items-icons/armour/C/armor_theca_leather_boots_i00.png",
  "Theca Leather Gloves":
    "/items-icons/armour/C/armor_theca_leather_gloves_i00.png",
  "Drake Leather Boots": "/items-icons/armour/C/armor_t21_b_i00.png",
  "Full Plate Boots": "/items-icons/armour/C/armor_t62_b_i00.png",
  "Drake Leather Gloves": "/items-icons/armour/C/armor_t21_g_i00.png",
  "Full Plate Gauntlets": "/items-icons/armour/C/armor_t62_g_i00.png",
  "Divine Gloves": "/items-icons/armour/C/armor_t57_g_i00.png",
  "Theca Leather Boots Texture":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Theca Leather Gloves Texture":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Drake Leather Boots Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Full Plate Boots Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Drake Leather Gloves Design":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Full Plate Gauntlets Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Divine Gloves Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Crystal Dagger": "/items-icons/weapon/C/weapon_crystal_dagger_i00.png",
  "Crystal Dagger Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Full Plate Helmet": "/items-icons/armour/D/armor_leather_helmet_i00.png",
  "Full Plate Shield":
    "/items-icons/armour/C/shield_full_plate_shield_i00.png",
  "Full Plate Helmet Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Full Plate Shield Fragment":
    "/items-icons/craft/etc_plate_silver_i00.png",
  Scorpion: "/items-icons/weapon/C/weapon_scorpion_i00.png",
  "Widow Maker": "/items-icons/weapon/C/weapon_widow_maker_i00.png",
  "Orcish Poleaxe": "/items-icons/weapon/C/weapon_orcish_poleaxe_i00.png",
  "Scorpion Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Widowmaker Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Orcish Poleaxe Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Theca Leather Armor":
    "/items-icons/armour/C/armor_theca_leather_mail_i00.png",
  "Theca Leather Gaiters":
    "/items-icons/armour/C/armor_theca_leather_gaiters_i00.png",
  "Drake Leather Armor": "/items-icons/armour/C/armor_t21_ul_i00.png",
  "Theca Leather Armor Pattern":
    "/items-icons/craft/etc_letter_red_i00.png",
  "Theca Leather Gaiters Pattern":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Drake Leather Armor Texture":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Full Plate Armor": "/items-icons/armour/C/armor_t62_ul_i00.png",
  "Full Plate Armor Temper": "/items-icons/craft/etc_plate_silver_i00.png",
  "Pa'agrian Axe": "/items-icons/weapon/C/weapon_paagrio_axe_i00.png",
  "Deadman's Staff":
    "/items-icons/weapon/C/weapon_deadmans_staff_i00.png",
  "Ghoul's Staff": "/items-icons/weapon/C/weapon_ghouls_staff_i00.png",
  "Demon's Staff": "/items-icons/weapon/C/weapon_demons_staff_i00.png",
  "Yaksa Mace": "/items-icons/weapon/C/weapon_yaksa_mace_i00.png",
  "Pa'agrian Axe Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Deadman's Staff Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Ghoul's Staff Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Demon's Staff Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Yaksa Mace Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Samurai Longsword":
    "/items-icons/weapon/C/weapon_samurai_longsword_i00.png",
  "Berserker Blade": "/items-icons/weapon/C/weapon_berserker_blade_i00.png",
  "Samurai Longsword Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Berserker Blade Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Divine Tunic": "/items-icons/armour/C/armor_t57_u_i00.png",
  "Divine Stockings": "/items-icons/armour/C/armor_t57_l_i00.png",
  "Divine Tunic Fabric":
    "/items-icons/craft/etc_piece_of_cloth_white_i00.png",
  "Divine Stocking Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Great Pata": "/items-icons/weapon/C/weapon_great_pata_i00.png",
  "Great Pata Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Necklace of Binding":
    "/items-icons/accessary/accessary_necklace_of_binding_i00.png",
  "Nassen's Earring":
    "/items-icons/accessary/accessary_nassens_earing_i00.png",
  "Ring of Binding":
    "/items-icons/accessary/accessary_ring_of_binding_i00.png",
  "Necklace of Binding Chain": "/items-icons/craft/etc_jewel_box_i00.png",
  "Nassen's Earring Gemstone": "/items-icons/craft/etc_gem_red_i00.png",
  "Ring of Binding Gemstone": "/items-icons/craft/etc_bead_silver_i00.png",
  "Eminence Bow": "/items-icons/weapon/C/weapon_eminence_bow_i00.png",
  "Eminence Bow Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Tunic of Zubei": "/items-icons/armour/B/armor_t56_u_i00.png",
  "Stockings of Zubei": "/items-icons/armour/B/armor_t56_l_i00.png",
  "Avadon Robe": "/items-icons/armour/B/armor_t59_ul_i00.png",
  "Tunic of Zubei Fabric": "/items-icons/craft/etc_leather_gray_i00.png",
  "Stockings of Zubei Fabric":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Avadon Robe Fabric": "/items-icons/craft/etc_leather_gray_i00.png",
  "Heavy War Axe": "/items-icons/weapon/B/weapon_heavy_war_axe_i00.png",
  "Sprite's Staff": "/items-icons/weapon/B/weapon_sprites_staff_i00.png",
  "Heavy War Axe Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Sprite's Staff Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Blue Wolf Breastplate": "/items-icons/armour/B/armor_t68_u_i00.png",
  "Blue Wolf Gaiters": "/items-icons/armour/B/armor_t68_l_i00.png",
  "Doom Plate Armor": "/items-icons/armour/B/armor_t71_ul_i00.png",
  "Blue Wolf Breastplate Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Blue Wolf Gaiters Material":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Doom Plate Armor Temper": "/items-icons/craft/etc_lump_white_i00.png",
  "Bow of Peril": "/items-icons/weapon/B/weapon_hazard_bow_i00.png",
  "Bow of Peril Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Greater Dye of INT <Int+4 Men-4>":
    "/items-icons/consumable/dyes/etc_int_hena_i02.png",
  "Greater Dye of INT <Int+4 Wit-4>":
    "/items-icons/consumable/dyes/etc_int_hena_i02.png",
  "Greater Dye of MEN <Men+4 Int-4>":
    "/items-icons/consumable/dyes/etc_men_hena_i02.png",
  "Blessed Scroll: Enchant Weapon (B)":
    "/items-icons/scrolls/B/etc_blessed_scrl_of_ench_wp_b_i03.png",
  "Earth Egg: B-Grade": "/items-icons/consumable/raid/etc_raid_c_i01.png",
  "Adamantite Earring":
    "/items-icons/accessary/B/accessary_adamantite_earing_i00.png",
  "Adamantite Ring":
    "/items-icons/accessary/B/accessary_adamantite_ring_i00.png",
  "Adamantite Necklace":
    "/items-icons/accessary/B/accessary_adamantite_necklace_i00.png",
  "Adamantite Earring Gemstone":
    "/items-icons/craft/etc_crystal_ball_gold_i00.png",
  "Adamantite Ring Wire": "/items-icons/craft/etc_jewel_box_i00.png",
  "Adamantite Necklace Chain": "/items-icons/craft/etc_jewel_box_i00.png",
  "Arthro Nail": "/items-icons/weapon/B/weapon_arthro_nail_i00.png",
  "Arthro Nail Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Zubei's Leather Shirt": "/items-icons/armour/B/armor_t65_u_i00.png",
  "Zubei's Leather Gaiters": "/items-icons/armour/B/armor_t65_l_i00.png",
  "Avadon Leather Armor": "/items-icons/armour/B/armor_t67_ul_i00.png",
  "Zubei's Leather Shirt Fabric":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Zubei's Leather Gaiter Texture":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Avadon Leather Armor Lining":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Great Axe": "/items-icons/weapon/B/weapon_great_axe_i00.png",
  "Great Axe Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Zubei's Boots": "/items-icons/armour/B/armor_t64_b_i02.png",
  "Avadon Boots": "/items-icons/armour/B/armor_t66_b_i02.png",
  "Zubei's Gauntlets": "/items-icons/armour/B/armor_t64_g_i02.png",
  "Avadon Gloves": "/items-icons/armour/B/armor_t66_g_i02.png",
  "Zubei's Boots Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Avadon Boots Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Zubei's Gauntlets Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Avadon Gloves Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Dark Elven Long Bow":
    "/items-icons/weapon/B/weapon_dark_elven_long_bow_i00.png",
  "Dark Elven Longbow Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Greater Dye of MEN <Men+3 Int-3>":
    "/items-icons/consumable/dyes/etc_men_hena_i02.png",
  "Greater Dye of MEN <Men+3 Wit-3>":
    "/items-icons/consumable/dyes/etc_men_hena_i02.png",
  "Zubei's Breastplate": "/items-icons/armour/B/armor_t64_u_i00.png",
  "Avadon Breastplate": "/items-icons/armour/B/armor_t66_u_i00.png",
  "Zubei's Gaiters": "/items-icons/armour/B/armor_t64_l_i00.png",
  "Avadon Gaiters": "/items-icons/armour/B/armor_t66_l_i00.png",
  "Zubei's Breastplate Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Avadon Breastplate Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Zubei's Gaiter Material": "/items-icons/craft/etc_leather_gray_i00.png",
  "Avadon Gaiters Material": "/items-icons/craft/etc_leather_gray_i00.png",
  "Great Sword": "/items-icons/weapon/B/weapon_great_sword_i00.png",
  "Keshanberk": "/items-icons/weapon/B/weapon_kshanberk_i00.png",
  "Sword of Valhalla":
    "/items-icons/weapon/B/weapon_sword_of_valhalla_i00.png",
  "Great Sword Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Keshanberk Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Sword of Valhalla Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Zubei's Helmet": "/items-icons/armour/B/armor_helmet_i00.png",
  "Zubei's Shield": "/items-icons/armour/B/shield_shrnoens_shield_i00.png",
  "Avadon Shield": "/items-icons/armour/B/shield_avadon_shield_i00.png",
  "Avadon Circlet": "/items-icons/armour/B/armor_leather_helmet_i00.png",
  "Zubei's Helmet Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Zubei's Shield Fragment": "/items-icons/craft/etc_plate_silver_i00.png",
  "Avadon Shield Fragment": "/items-icons/craft/etc_plate_silver_i00.png",
  "Avadon Circlet Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Kris": "/items-icons/weapon/B/weapon_kris_i00.png",
  "Hell Knife": "/items-icons/weapon/B/weapon_hell_knife_i00.png",
  "Kris Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Hell Knife Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Greater Dye of STR <Str+4 Con-4>":
    "/items-icons/consumable/dyes/etc_str_hena_i02.png",
  "Greater Dye of STR <Str+4 Dex-4>":
    "/items-icons/consumable/dyes/etc_str_hena_i02.png",
  "Greater Dye of CON <Con+4 Str-4>":
    "/items-icons/consumable/dyes/etc_con_hena_i02.png",
  "Scroll: Enchant Weapon (B)":
    "/items-icons/scrolls/B/etc_scroll_of_enchant_weapon_i03.png",
  "Spell Breaker": "/items-icons/weapon/B/weapon_spell_breaker_i00.png",
  "Spell Breaker Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Ice Storm Hammer":
    "/items-icons/weapon/B/weapon_ice_storm_hammer_i00.png",
  "Ice Storm Hammer Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Greater Dye of CON <Con+4 Dex-4>":
    "/items-icons/consumable/dyes/etc_con_hena_i02.png",
  "Greater Dye of DEX <Dex+4 Str-4>":
    "/items-icons/consumable/dyes/etc_dex_hena_i02.png",
  "Greater Dye of DEX <Dex+4 Con-4>":
    "/items-icons/consumable/dyes/etc_dex_hena_i02.png",
  "Scroll: Enchant Armor (B)":
    "/items-icons/scrolls/B/etc_scroll_of_enchant_armor_i03.png",
  "Blessed Scroll: Enchant Armor (B)":
    "/items-icons/scrolls/B/etc_blessed_scrl_of_ench_am_b_i03.png",
  "Greater Dye of MEN <Men+4 Wit-4>":
    "/items-icons/consumable/dyes/etc_men_hena_i02.png",
  "Greater Dye of WIT <Wit+4 Int-4>":
    "/items-icons/consumable/dyes/etc_wit_hena_i02.png",
  "Greater Dye of WIT <Wit+4 Men-4>":
    "/items-icons/consumable/dyes/etc_wit_hena_i02.png",
  "Blue Wolf Leather Armor": "/items-icons/armour/B/armor_t69_ul_i00.png",
  "Leather Armor of Doom": "/items-icons/armour/B/armor_t72_ul_i00.png",
  "Blue Wolf Leather Armor Texture":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Leather Armor of Doom Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Demon Dagger": "/items-icons/weapon/B/weapon_demons_sword_i00.png",
  "Demon Dagger Edge": "/items-icons/craft/etc_sword_body_i00.png",
  Lance: "/items-icons/weapon/B/weapon_lancia_i00.png",
  "Lance Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Bellion Cestus": "/items-icons/weapon/B/weapon_bellion_cestus_i00.png",
  "Bellion Cestus Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Blue Wolf Tunic": "/items-icons/armour/B/armor_t70_u_i00.png",
  "Blue Wolf Stockings": "/items-icons/armour/B/armor_t70_l_i00.png",
  "Tunic of Doom": "/items-icons/armour/B/armor_t73_u_i00.png",
  "Stockings of Doom": "/items-icons/armour/B/armor_t73_l_i00.png",
  "Blue Wolf Tunic Fabric": "/items-icons/craft/etc_leather_gray_i00.png",
  "Tunic of Doom Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Blue Wolf Stockings Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Stockings of Doom Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Sword of Damascus":
    "/items-icons/weapon/B/weapon_sword_of_damascus_i00.png",
  "Sword of Damascus Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Sealed Dark Crystal Leather Armor":
    "/items-icons/armour/A/armor_t75_u_i02.png",
  "Sealed Dark Crystal Leggings": "/items-icons/armour/A/armor_t75_l_i02.png",
  "Sealed Tallum Leather Armor": "/items-icons/armour/A/armor_t78_ul_i02.png",
  "Sealed Dark Crystal Leather Armor Pattern":
    "/items-icons/craft/etc_letter_red_i00.png",
  "Sealed Dark Crystal Leggings Design":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sealed Tallum Leather Armor Pattern":
    "/items-icons/craft/etc_letter_red_i00.png",
  "Carnage Bow": "/items-icons/weapon/A/weapon_carnium_bow_i00.png",
  "Carnage Bow Stave": "/items-icons/craft/etc_branch_gold_i00.png",
  "Blessed Scroll: Enchant Armor (A)":
    "/items-icons/scrolls/A/etc_blessed_scrl_of_ench_am_a_i04.png",
  "Scroll: Enchant Weapon (A)":
    "/items-icons/scrolls/A/etc_scroll_of_enchant_weapon_i04.png",
  "Sealed Dark Crystal Helmet": "/items-icons/armour/A/armor_helmet_i02.png",
  "Sealed Tallum Helmet": "/items-icons/armour/A/armor_helmet_i02.png",
  "Sealed Dark Crystal Shield":
    "/items-icons/armour/A/shield_dark_crystal_shield_i02.png",
  "Sealed Dark Crystal Helmet Design":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sealed Dark Crystal Shield Fragment":
    "/items-icons/craft/etc_jewel_box_i00.png",
  "Sealed Tallum Helm Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Tallum Blade": "/items-icons/weapon/A/weapon_tallum_blade_i00.png",
  "Elemental Sword": "/items-icons/weapon/A/weapon_elemental_sword_i00.png",
  "Tallum Blade Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Elemental Sword Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Scroll: Enchant Armor (A)":
    "/items-icons/scrolls/A/etc_scroll_of_enchant_armor_i04.png",
  "Blessed Scroll: Enchant Weapon (A)":
    "/items-icons/scrolls/A/etc_blessed_scrl_of_ench_wp_a_i04.png",
  "Sealed Dark Crystal Gloves": "/items-icons/armour/A/armor_t74_g_i02.png",
  "Sealed Dark Crystal Boots": "/items-icons/armour/A/armor_t74_b_i02.png",
  "Sealed Tallum Gloves": "/items-icons/armour/A/armor_t77_g_i02.png",
  "Sealed Tallum Boots": "/items-icons/armour/A/armor_t77_b_i02.png",
  "Sealed Dark Crystal Gloves Design":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sealed Dark Crystal Boots Lining":
    "/items-icons/craft/etc_piece_of_cloth_black_i00.png",
  "Sealed Tallum Gloves Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sealed Tallum Boots Lining":
    "/items-icons/craft/etc_piece_of_cloth_black_i00.png",
  "Earring of Black Ore":
    "/items-icons/accessary/B/accessary_earing_of_black_ore_i00.png",
  "Ring of Black Ore":
    "/items-icons/accessary/B/accessary_ring_of_black_ore_i00.png",
  "Necklace of Black Ore":
    "/items-icons/accessary/B/accessary_necklace_of_black_ore_i00.png",
  "Earring of Black Ore Piece":
    "/items-icons/craft/etc_broken_crystal_silver_i00.png",
  "Ring of Black Ore Gemstone": "/items-icons/craft/etc_gem_black_i00.png",
  "Necklace of Black Ore Beads": "/items-icons/craft/etc_bead_silver_i00.png",
  "Deadman's Glory": "/items-icons/weapon/B/weapon_deadmans_glory_i00.png",
  "Art of Battle Axe":
    "/items-icons/weapon/B/weapon_art_of_battle_axe_i00.png",
  "Staff of Evil Spirits":
    "/items-icons/weapon/B/weapon_staff_of_evil_sprit_i00.png",
  "Deadman's Glory Stone": "/items-icons/craft/etc_squares_gray_i00.png",
  "Art of Battle Axe Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Evil Spirit Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Dasparion's Staff": "/items-icons/weapon/A/weapon_dasparions_staff_i00.png",
  "Meteor Shower": "/items-icons/weapon/A/weapon_meteor_shower_i00.png",
  "Dasparion's Staff Edge": "/items-icons/craft/etc_squares_silver_i00.png",
  "Meteor Shower Head": "/items-icons/craft/etc_squares_silver_i00.png",
  "Doom Shield": "/items-icons/armour/B/shield_doom_shield_i00.png",
  "Doom Shield Fragment": "/items-icons/craft/etc_plate_silver_i00.png",
  "Blue Wolf Helmet": "/items-icons/armour/B/armor_leather_helmet_i00.png",
  "Doom Helmet": "/items-icons/armour/B/armor_leather_helmet_i00.png",
  "Blue Wolf Helmet Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Doom Helmet Pattern": "/items-icons/craft/etc_letter_red_i00.png",
  "Circlet of Ice Fairy Sirra":
    "/items-icons/cosmetics/accessory_ice_queen_i00.png",
  "Silver Arrow":
    "/items-icons/consumable/arrows/etc_silver_quiver_i00.png",
  "Kaim Vanul's Bones":
    "/items-icons/weapon/B/weapon_bone_of_kaim_vanul_i00.png",
  "Star Buster": "/items-icons/weapon/B/weapon_star_buster_i00.png",
  "Bones Head of Kaim Vanul": "/items-icons/craft/etc_squares_gray_i00.png",
  "Star Buster Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Sealed Phoenix Necklace":
    "/items-icons/accessary/A/accessary_phoenixs_necklace_i02.png",
  "Sealed Phoenix Earring":
    "/items-icons/accessary/A/accessary_phoenixs_earing_i02.png",
  "Sealed Phoenix Ring":
    "/items-icons/accessary/A/accessary_phoenixs_ring_i02.png",
  "Sealed Phoenix Necklace Beads":
    "/items-icons/craft/etc_crystal_ball_green_i00.png",
  "Sealed Phoenix Earring Gemstone": "/items-icons/craft/etc_gem_blue_i00.png",
  "Sealed Phoenix Ring Gemstone": "/items-icons/craft/etc_gem_blue_i00.png",
  "Boots of Doom": "/items-icons/armour/B/armor_t71_b_i02.png",
  "Blue Wolf Boots": "/items-icons/armour/B/armor_t68_b_i02.png",
  "Doom Gloves": "/items-icons/armour/B/armor_t71_g_i02.png",
  "Blue Wolf Gloves": "/items-icons/armour/B/armor_t68_g_i02.png",
  "Doom Boots Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Blue Wolf Boots Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Doom Gloves Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Blue Wolf Gloves Fabric": "/items-icons/craft/etc_leather_gray_i00.png",
  "Blood Tornado": "/items-icons/weapon/A/weapon_blood_tornado_i00.png",
  "Blood Tornado Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Sealed Dark Crystal breastplate":
    "/items-icons/armour/A/armor_t74_u_i02.png",
  "Sealed Dark Crystal Gaiters": "/items-icons/armour/A/armor_t74_l_i02.png",
  "Sealed Tallum Plate Armor":
    "/items-icons/armour/A/armor_t77_ul_i02.png",
  "Sealed Dark Crystal Breastplate Pattern":
    "/items-icons/craft/etc_letter_red_i00.png",
  "Sealed Dark Crystal Gaiters Pattern":
    "/items-icons/craft/etc_letter_red_i00.png",
  "Sealed Tallum Plate Armor Pattern":
    "/items-icons/craft/etc_letter_red_i00.png",
  "Sealed Tallum Tunic": "/items-icons/armour/A/armor_t79_u_i02.png",
  "Sealed Tallum Stockings": "/items-icons/armour/A/armor_t79_l_i02.png",
  "Sealed Dark Crystal Robe": "/items-icons/armour/A/armor_t76_ul_i02.png",
  "Sealed Tallum Tunic Texture":
    "/items-icons/craft/etc_leather_yellow_i00.png",
  "Sealed Tallum Stockings Fabric":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Sealed Dark Crystal Robe Fabric":
    "/items-icons/craft/etc_leather_gray_i00.png",
  Halberd: "/items-icons/weapon/A/weapon_halbard_i00.png",
  "Halberd Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Bloody Orchid": "/items-icons/weapon/A/weapon_bloody_orchid_i00.png",
  "Bloody Orchid Head": "/items-icons/craft/etc_sword_body_i00.png",
  "Ancient Book - Divine Inspiration (Original Language Version)":
    "/items-icons/consumable/books/etc_add_buffslot_i01.png",
  "Sealed Armor of Nightmare": "/items-icons/armour/A/armor_t80_ul_i02.png",
  "Sealed Majestic Plate Armor":
    "/items-icons/armour/A/armor_t83_ul_i02.png",
  "Sealed Armor of Nightmare Pattern":
    "/items-icons/craft/etc_letter_red_i00.png",
  "Sealed Majestic Plate Armor Pattern":
    "/items-icons/craft/etc_letter_red_i00.png",
  "Dragon Grinder": "/items-icons/weapon/A/weapon_dragon_grinder_i00.png",
  "Dragon Grinder Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Blessed Scroll: Enchant Weapon (S)":
    "/items-icons/scrolls/S/etc_blessed_scrl_of_ench_wp_s_i05.png",
  "Blessed Scroll: Enchant Armor (S)":
    "/items-icons/scrolls/S/etc_blessed_scrl_of_ench_am_s_i05.png",
  "Sealed Nightmare Robe": "/items-icons/armour/A/armor_t82_ul_i02.png",
  "Sealed Majestic Robe": "/items-icons/armour/A/armor_t85_ul_i02.png",
  "Sealed Nightmare Robe Fabric": "/items-icons/craft/etc_leather_gray_i00.png",
  "Sealed Majestic Robe Fabric": "/items-icons/craft/etc_leather_gray_i00.png",
  "Soul Bow": "/items-icons/weapon/A/weapon_soul_bow_i00.png",
  "Soul Bow Stave": "/items-icons/craft/etc_branch_gold_i00.png",
  "Scroll: Enchant Weapon (S)":
    "/items-icons/scrolls/S/etc_scroll_of_enchant_weapon_i05.png",
  "Scroll: Enchant Armor (S)":
    "/items-icons/scrolls/S/etc_scroll_of_enchant_armor_i05.png",
  "Sealed Majestic Necklace":
    "/items-icons/accessary/A/accessary_inferno_necklace_i02.png",
  "Sealed Majestic Earring":
    "/items-icons/accessary/A/accessary_inferno_earing_i02.png",
  "Sealed Majestic Ring":
    "/items-icons/accessary/A/accessary_inferno_ring_i02.png",
  "Sealed Majestic Necklace Beads":
    "/items-icons/craft/etc_crystal_ball_green_i00.png",
  "Sealed Majestic Earring Gemstone": "/items-icons/craft/etc_gem_blue_i00.png",
  "Sealed Majestic Ring Gemstone": "/items-icons/craft/etc_gem_blue_i00.png",
  "Soul Separator": "/items-icons/weapon/A/weapon_soul_separator_i00.png",
  "Soul Separator Head": "/items-icons/craft/etc_sword_body_i00.png",
  "Sealed Gauntlets of Nightmare": "/items-icons/armour/A/armor_t80_g_i02.png",
  "Sealed Boots of Nightmare": "/items-icons/armour/A/armor_t80_b_i02.png",
  "Sealed Majestic Gauntlets": "/items-icons/armour/A/armor_t83_g_i02.png",
  "Sealed Majestic Boots": "/items-icons/armour/A/armor_t83_b_i02.png",
  "Sealed Gauntlets of Nightmare Design":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sealed Boots of Nightmare Lining":
    "/items-icons/craft/etc_piece_of_cloth_black_i00.png",
  "Sealed Majestic Gauntlets Design":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sealed Majestic Boots Lining":
    "/items-icons/craft/etc_piece_of_cloth_black_i00.png",
  Elysian: "/items-icons/weapon/A/weapon_elysian_i00.png",
  "Branch of The Mother Tree":
    "/items-icons/weapon/A/weapon_worldtrees_branch_i00.png",
  "Elysian Head": "/items-icons/craft/etc_squares_silver_i00.png",
  "Branch of The Mother Tree Head":
    "/items-icons/craft/etc_squares_silver_i00.png",
  "Sealed Helm of Nightmare":
    "/items-icons/armour/A/armor_leather_helmet_i02.png",
  "Sealed Majestic Circlet":
    "/items-icons/armour/A/armor_leather_helmet_i02.png",
  "Sealed Shield of Nightmare":
    "/items-icons/armour/A/shield_shield_of_nightmare_i02.png",
  "Sealed Helm of Nightmare Design": "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sealed Shield of Nightmare Fragment":
    "/items-icons/craft/etc_jewel_box_i00.png",
  "Sealed Majestic Circlet Design":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Tallum Glaive": "/items-icons/weapon/A/weapon_tallum_glaive_i00.png",
  "Tallum Glaive Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Sealed Leather Armor of Nightmare":
    "/items-icons/armour/A/armor_t81_ul_i02.png",
  "Sealed Majestic Leather Armor":
    "/items-icons/armour/A/armor_t84_ul_i02.png",
  "Sealed Leather Armor of Nightmare Fabric":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Sealed Majestic Leather Armor Fabric":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Dragon Slayer": "/items-icons/weapon/A/weapon_dragon_slayer_i00.png",
  "Sword of Miracles": "/items-icons/weapon/A/weapon_sword_of_miracle_i00.png",
  "Dark Legion's Edge":
    "/items-icons/weapon/A/weapon_dark_legions_edge_i00.png",
  "Dragon Slayer Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Sword of Miracles Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Dark Legion's Edge Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Sealed Imperial Crusader Breastplate":
    "/items-icons/armour/S/armor_t88_u_i02.png",
  "Sealed Imperial Crusader Gaiters":
    "/items-icons/armour/S/armor_t88_l_i02.png",
  "Sealed Imperial Crusader Breastplate Part":
    "/items-icons/craft/etc_plate_silver_i00.png",
  "Sealed Imperial Crusader Gaiters Pattern":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Forgotten Blade": "/items-icons/weapon/S/weapon_forgotten_blade_i00.png",
  "Heaven's Divider": "/items-icons/weapon/S/weapon_heavens_divider_i00.png",
  "Forgotten Blade Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Heaven's Divider Edge": "/items-icons/craft/etc_sword_body_i00.png",
  "Sealed Major Arcana Robe": "/items-icons/armour/S/armor_t90_ul_i02.png",
  "Sealed Major Arcana Robe Part": "/items-icons/craft/etc_plate_silver_i00.png",
  "Saint Spear": "/items-icons/weapon/S/weapon_saint_spear_i00.png",
  "Saint Spear Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Sealed Tateossian Earring":
    "/items-icons/accessary/S/accessory_tateossian_earring_i02.png",
  "Sealed Tateossian Ring":
    "/items-icons/accessary/S/accessory_tateossian_ring_i02.png",
  "Sealed Tateossian Necklace":
    "/items-icons/accessary/S/accessory_tateossian_necklace_i02.png",
  "Sealed Tateossian Earring Part":
    "/items-icons/craft/etc_broken_crystal_silver_i00.png",
  "Sealed Tateossian Ring Gem":
    "/items-icons/craft/etc_crystal_ball_gold_i00.png",
  "Sealed Tateossian Necklace Chain":
    "/items-icons/craft/etc_jewel_box_i00.png",
  "Blessed Scroll of Resurrection":
    "/items-icons/scrolls/etc_scroll_of_resurrection_i01.png",
  "Sealed Imperial Crusader Gauntlet":
    "/items-icons/armour/S/armor_t88_g_i02.png",
  "Sealed Imperial Crusader Boots": "/items-icons/armour/S/armor_t88_b_i02.png",
  "Sealed Draconic Leather Glove": "/items-icons/armour/S/armor_t89_g_i02.png",
  "Sealed Draconic Leather Boots": "/items-icons/armour/S/armor_t89_b_i02.png",
  "Sealed Major Arcana Glove": "/items-icons/armour/S/armor_t90_g_i02.png",
  "Sealed Major Arcana Boots": "/items-icons/armour/S/armor_t90_b_i02.png",
  "Sealed Imperial Crusader Gauntlets Design":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sealed Imperial Crusader Boots Design":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sealed Draconic Leather Gloves Fabric":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Sealed Draconic Leather Boots Design":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sealed Major Arcana Gloves fabric":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Sealed Major Arcana Boots Design":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Basalt Battlehammer":
    "/items-icons/weapon/S/weapon_basalt_battlehammer_i00.png",
  "Imperial Staff": "/items-icons/weapon/S/weapon_imperial_staff_i00.png",
  "Dragon Hunter Axe":
    "/items-icons/weapon/S/weapon_dragon_hunter_axe_i00.png",
  "Arcana Mace": "/items-icons/weapon/S/weapon_arcana_mace_i00.png",
  "Basalt Battlehammer Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Imperial Staff Head": "/items-icons/craft/etc_bark_blue_i00.png",
  "Dragon Hunter Axe Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Arcana Mace Head": "/items-icons/craft/etc_squares_gray_i00.png",
  "Demon Splinter": "/items-icons/weapon/S/weapon_demon_splinter_i00.png",
  "Demon Splinter Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Sealed Draconic Leather Armor": "/items-icons/armour/S/armor_t89_ul_i02.png",
  "Sealed Draconic Leather Armor Part":
    "/items-icons/craft/etc_leather_gray_i00.png",
  "Angel Slayer": "/items-icons/weapon/S/weapon_angel_slayer_i00.png",
  "Angel Slayer Blade": "/items-icons/craft/etc_sword_body_i00.png",
  "Sealed Imperial Crusader Shield":
    "/items-icons/armour/S/shield_imperial_crusader_shield_i02.png",
  "Sealed Imperial Crusader Helmet":
    "/items-icons/armour/S/armor_helmet_i02.png",
  "Sealed Draconic Leather Helmet":
    "/items-icons/armour/S/armor_leather_helmet_i02.png",
  "Sealed Major Arcana Circlet":
    "/items-icons/armour/S/armor_leather_helmet_i02.png",
  "Sealed Imperial Crusader Shield Part":
    "/items-icons/craft/etc_plate_silver_i00.png",
  "Sealed Imperial Crusader Helmet Pattern":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sealed Draconic Leather Helmet Pattern":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Sealed Major Arcana Circlet Pattern":
    "/items-icons/craft/etc_pouch_brown_i00.png",
  "Draconic Bow": "/items-icons/weapon/S/weapon_draconic_bow_i00.png",
  "Draconic Bow Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  "Life Stone: level 70":
    "/items-icons/consumable/life_stones/etc_mineral_general_i02.png",
  "High-Grade Life Stone: level 70":
    "/items-icons/consumable/life_stones/etc_mineral_rare_i02.png",
  "Top-Grade Life Stone: level 70":
    "/items-icons/consumable/life_stones/etc_mineral_unique_i02.png",
  "Angel Halo": "/items-icons/cosmetics/accessary_angel_circlet_i00.png",
  "Life Stone: level 76":
    "/items-icons/consumable/life_stones/etc_mineral_general_i03.png",
  "Mid-Grade Life Stone: level 76":
    "/items-icons/consumable/life_stones/etc_mineral_special_i03.png",
  "High-Grade Life Stone: level 76":
    "/items-icons/consumable/life_stones/etc_mineral_rare_i03.png",
  "Demon Circlet": "/items-icons/cosmetics/accessary_demon_circlet_i00.png",
};

export function getItemIcon(itemName: string): string | undefined {
  return itemIcons[itemName];
}

export type ItemCategory =
  | "weapon"
  | "armor"
  | "accessory"
  | "cosmetic"
  | "craft"
  | "scroll"
  | "consumable";
export type ItemGrade = "S" | "A" | "B" | "C" | "D" | "none";

const GRADE_ORDER: Record<ItemGrade, number> = {
  S: 0,
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  none: 5,
};

const ICON_FOLDER_CATEGORY: Record<string, ItemCategory> = {
  weapon: "weapon",
  armour: "armor",
  accessary: "accessory",
  cosmetics: "cosmetic",
  craft: "craft",
  scrolls: "scroll",
  consumable: "consumable",
};

const GRADE_LETTERS = new Set(["S", "A", "B", "C", "D"]);

export function getItemCategory(itemName: string): ItemCategory {
  const iconPath = itemIcons[itemName];
  if (iconPath) {
    const folder = iconPath.split("/")[2]; // "/items-icons/<folder>/..."
    const category = ICON_FOLDER_CATEGORY[folder];
    if (category) return category;
  }
  // No icon mapped yet — best-effort guess from the name, falling back to
  // the consumables catch-all (matches how "everything else" sorts last).
  if (/scroll/i.test(itemName)) return "scroll";
  return "consumable";
}

export function getItemGrade(itemName: string): ItemGrade {
  const iconPath = itemIcons[itemName];
  if (iconPath) {
    // "/items-icons/<category>/<grade>/<file>.png" has 5 segments; a path
    // with no grade folder ("/items-icons/<category>/<file>.png") has 4.
    const segments = iconPath.split("/");
    const maybeGrade = segments.length === 5 ? segments[3] : null;
    if (maybeGrade && GRADE_LETTERS.has(maybeGrade)) {
      return maybeGrade as ItemGrade;
    }
    return "none";
  }
  // No icon mapped yet — L2 item names commonly end in "(D)", "(S)" etc.
  const match = itemName.match(/\(([SABCD])\)\s*$/);
  return match ? (match[1] as ItemGrade) : "none";
}

// Body-slot order for armor pieces (helmet down to boots, shield last since
// it's off-hand rather than a body slot). Read off the icon filename, which
// follows the game's own part-suffix convention (_u_ upper, _l_ lower, _g_
// gloves, _b_ boots, _ul_ full-body) with a keyword fallback for the
// descriptively-named icons that don't use that suffix scheme.
function getArmorSlotOrder(itemName: string): number {
  const iconPath = itemIcons[itemName];
  const file = (iconPath?.split("/").pop() ?? "").toLowerCase();
  const haystack = `${file} ${itemName.toLowerCase()}`;

  if (/helmet|hood/.test(haystack)) return 0;
  // "mail"/"rag" need a boundary check to avoid matching inside unrelated
  // words (e.g. "fragment"), but \b treats "_" as a word character, so it
  // silently fails to match "mail" glued between underscores in a filename
  // like armor_theca_leather_mail_i00.png — exclude adjacent letters
  // instead, since "_" and "." are never letters.
  if (
    /_ul_|_u_|tunic|shirt|breastplate|(?<![a-z])mail(?![a-z])|(?<![a-z])rag(?![a-z])/.test(
      haystack,
    )
  )
    return 1;
  if (/_l_|gaiters|stocking|hose/.test(haystack)) return 2;
  if (/_g_|glove|gauntlet/.test(haystack)) return 3;
  if (/_b_|boots?/.test(haystack)) return 4;
  if (/^shield_|shield/.test(haystack)) return 5;
  return 6;
}

// Within the consumable category, raid drops (Destruction Tombstone, Earth
// Egg, etc.) come before dyes — read off the icon's consumable/<raid|dyes>/
// subfolder.
const CONSUMABLE_SUBFOLDER_ORDER: Record<string, number> = {
  raid: 0,
  dyes: 1,
  arrows: 2,
  books: 3,
};

function getConsumableSubOrder(itemName: string): number {
  const iconPath = itemIcons[itemName];
  if (!iconPath) return 4;
  const subfolder = iconPath.split("/")[3];
  return CONSUMABLE_SUBFOLDER_ORDER[subfolder] ?? 4;
}

// Trailing words that mark an item as raw crafting material for some
// piece of gear rather than the piece itself (Head/Blade/Edge for
// weapons, Pattern/Fabric/Fragment for armor, Gemstone/Chain/Wire for
// jewelry, etc.).
const SET_MATERIAL_WORDS = new Set([
  "pattern",
  "design",
  "fabric",
  "texture",
  "fragment",
  "part",
  "piece",
  "material",
  "gemstone",
  "gem",
  "chain",
  "wire",
  "page",
  "stone",
  "beads",
  "temper",
  "lining",
  "head",
  "blade",
  "edge",
  "shaft",
]);

// Generic body-slot words: stripping these off an item name leaves just
// the set's distinguishing name (e.g. "Karmian Tunic" and "Karmian
// Stockings" both reduce to "karmian"), so a multi-piece set groups
// together instead of scattering by slot.
const SET_SLOT_WORDS = new Set([
  "tunic",
  "shirt",
  "mail",
  "breastplate",
  "robe",
  "rag",
  "armor",
  "armour",
  "gaiters",
  "gaiter",
  "stockings",
  "stocking",
  "hose",
  "gloves",
  "glove",
  "gauntlets",
  "gauntlet",
  "boots",
  "boot",
  "helmet",
  "hood",
  "circlet",
  "shield",
  "earring",
  "ring",
  "necklace",
]);

// Qualifier words the source site applies inconsistently across a set's
// pieces (e.g. "Mithril Shirt" vs "Tempered Mithril Gaiters" — same set,
// only one piece keeps "Tempered"), so they're stripped rather than
// treated as part of the set's identity.
const SET_QUALIFIER_WORDS = new Set(["tempered", "reinforced"]);

// Reduces an item name to its equipment-set identity by dropping slot,
// material, and inconsistently-applied qualifier words, so a piece and
// its crafting material — or two pieces of the same set — land on the
// same key regardless of which words the site happened to keep.
function getSetKey(itemName: string): string {
  const words = itemName
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  const kept = words.filter(
    (w) => !SET_MATERIAL_WORDS.has(w) && !SET_QUALIFIER_WORDS.has(w),
  );
  const withoutSlot = kept.filter((w) => !SET_SLOT_WORDS.has(w));
  return (withoutSlot.length > 0 ? withoutSlot : kept).join(" ");
}

// Equipment type order used as a tiebreaker within a tier (see getTier
// below): weapon sets before armor sets before accessory sets. A craft
// item (a set's crafting material) has no type of its own, so it inherits
// its set-mate's type via SET_KEY_TYPE_BUCKET — that's what keeps a
// weapon's material grouped with other weapon materials rather than
// sorting in with armor's.
const TYPE_BUCKET: Partial<Record<ItemCategory, number>> = {
  weapon: 0,
  armor: 1,
  accessory: 2,
  cosmetic: 3,
};
const CRAFT_FALLBACK_BUCKET = 4;
const SCROLL_BUCKET = 5;
const CONSUMABLE_BUCKET = 6;

// setKey -> bucket, built once from every non-craft item in itemIcons so a
// craft item can look up which type (weapon/armor/accessory) its set
// belongs to. First occurrence wins, which is deterministic since
// itemIcons has a fixed iteration order.
const SET_KEY_TYPE_BUCKET: Map<string, number> = (() => {
  const map = new Map<string, number>();
  for (const name of Object.keys(itemIcons)) {
    const category = getItemCategory(name);
    const bucket = TYPE_BUCKET[category];
    if (bucket === undefined) continue;
    const key = getSetKey(name);
    if (!map.has(key)) map.set(key, bucket);
  }
  return map;
})();

// Top-level tier: every equippable piece (weapon/armor/accessory) before
// every crafting material (craft), before scrolls, before everything else
// — matches the game's own drop-value ordering, so a boss's actual gear
// never gets outranked by some other set's raw materials.
function getTier(itemName: string): number {
  const category = getItemCategory(itemName);
  if (category === "craft") return 1;
  if (category === "scroll") return SCROLL_BUCKET;
  if (category === "consumable") return CONSUMABLE_BUCKET;
  return 0; // weapon/armor/accessory
}

function getSortType(itemName: string): number {
  const category = getItemCategory(itemName);
  const directBucket = TYPE_BUCKET[category];
  if (directBucket !== undefined) return directBucket;
  return SET_KEY_TYPE_BUCKET.get(getSetKey(itemName)) ?? CRAFT_FALLBACK_BUCKET;
}

export function compareDrops(
  a: { item: string },
  b: { item: string },
): number {
  const tierDiff = getTier(a.item) - getTier(b.item);
  if (tierDiff !== 0) return tierDiff;

  if (getTier(a.item) < SCROLL_BUCKET) {
    // Equipment (and its crafting materials): type outranks grade, so gear
    // always groups weapon-then-armor-then-accessory even when a lower-tier
    // piece happens to drop at a higher grade than another.
    const typeDiff = getSortType(a.item) - getSortType(b.item);
    if (typeDiff !== 0) return typeDiff;

    const gradeDiff =
      GRADE_ORDER[getItemGrade(a.item)] - GRADE_ORDER[getItemGrade(b.item)];
    if (gradeDiff !== 0) return gradeDiff;

    const setDiff = getSetKey(a.item).localeCompare(getSetKey(b.item));
    if (setDiff !== 0) return setDiff;
  } else {
    const gradeDiff =
      GRADE_ORDER[getItemGrade(a.item)] - GRADE_ORDER[getItemGrade(b.item)];
    if (gradeDiff !== 0) return gradeDiff;
  }

  const slotDiff = getArmorSlotOrder(a.item) - getArmorSlotOrder(b.item);
  if (slotDiff !== 0) return slotDiff;

  const consumableDiff =
    getConsumableSubOrder(a.item) - getConsumableSubOrder(b.item);
  if (consumableDiff !== 0) return consumableDiff;

  return a.item.localeCompare(b.item);
}
