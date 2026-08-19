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
  "Brigandine Helmet": "/items-icons/armour/armor_leather_helmet_i00.png",
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
  "Greater Dye of CON": "/items-icons/consumable/etc_con_hena_i02.png",
  "Greater Dye of CON <Con+1 Str-1>":
    "/items-icons/consumable/etc_con_hena_i02.png",
  "Greater Dye of CON <Con+1 Dex-1>":
    "/items-icons/consumable/etc_con_hena_i02.png",
  "Greater Dye of DEX": "/items-icons/consumable/etc_dex_hena_i02.png",
  "Greater Dye of DEX <Dex+1 Str-1>":
    "/items-icons/consumable/etc_dex_hena_i02.png",
  "Greater Dye of DEX <Dex+1 Con-1>":
    "/items-icons/consumable/etc_dex_hena_i02.png",
  "Greater Dye of STR": "/items-icons/consumable/etc_str_hena_i02.png",
  "Greater Dye of STR <Str+1 Con-1>":
    "/items-icons/consumable/etc_str_hena_i02.png",
  "Greater Dye of STR <Str+1 Dex-1>":
    "/items-icons/consumable/etc_str_hena_i02.png",
  "Greater Dye of INT <Int+1 Men-1>":
    "/items-icons/consumable/etc_int_hena_i02.png",
  "Greater Dye of INT <Int+1 Wit-1>":
    "/items-icons/consumable/etc_int_hena_i02.png",
  "Greater Dye of Men <Men+1 Int-1>":
    "/items-icons/consumable/etc_men_hena_i02.png",
  "Greater Dye of Men <Men+1 Wit-1>":
    "/items-icons/consumable/etc_men_hena_i02.png",
  "Greater Dye of WIT <Wit+1 Int-1>":
    "/items-icons/consumable/etc_wit_hena_i02.png",
  "Greater Dye of WIT <Wit+1 Men-1>":
    "/items-icons/consumable/etc_wit_hena_i02.png",
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
  "Plate Helmet": "/items-icons/armour/armor_leather_helmet_i00.png",
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
  "Assault Boots": "/items-icons/armour/armor_t44_b_i00.png",
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
    "/items-icons/consumable/etc_dex_hena_i02.png",
  "Greater Dye of INT <Int+2 Men-2>":
    "/items-icons/consumable/etc_int_hena_i02.png",
  "Greater Dye of INT <Int+2 Wit-2>":
    "/items-icons/consumable/etc_int_hena_i02.png",
  "Mithril Shirt":
    "/items-icons/armour/C/armor_tempered_mithril_shirt_i00.png",
  "Tempered Mithril Gaiters":
    "/items-icons/armour/C/armor_tempered_mithril_gaiters_i00.png",
  "Mithril Shirt Fabric":
    "/items-icons/craft/etc_piece_of_cloth_white_i00.png",
  "Tempered Mithril Gaiters Fragment":
    "/items-icons/craft/etc_plate_silver_i00.png",
  "Greater Dye of CON <Con+2 Str-2>":
    "/items-icons/consumable/etc_con_hena_i02.png",
  "Greater Dye of CON <Con+2 Dex-2>":
    "/items-icons/consumable/etc_con_hena_i02.png",
  "Greater Dye of DEX <Dex+2 Str-2>":
    "/items-icons/consumable/etc_dex_hena_i02.png",
  "Greater Dye of STR <Str+2 Con-2>":
    "/items-icons/consumable/etc_str_hena_i02.png",
  "Greater Dye of STR <Str+2 Dex-2>":
    "/items-icons/consumable/etc_str_hena_i02.png",
  "Greater Dye of WIT <Wit+2 Men-2>":
    "/items-icons/consumable/etc_wit_hena_i02.png",
  "Greater Dye of Men <Men+2 Int-2>":
    "/items-icons/consumable/etc_men_hena_i02.png",
  "Greater Dye of Men <Men+2 Wit-2>":
    "/items-icons/consumable/etc_men_hena_i02.png",
  "Greater Dye of WIT <Wit+2 Int-2>":
    "/items-icons/consumable/etc_wit_hena_i02.png",
  "Crystallized Ice Bow":
    "/items-icons/weapon/C/weapon_crystallized_ice_bow_i00.png",
  "Crystallized Ice Bow Shaft": "/items-icons/craft/etc_branch_gold_i00.png",
  Eldarake: "/items-icons/armour/C/shield_eldarake_i00.png",
  "Chain Hood": "/items-icons/armour/armor_leather_helmet_i00.png",
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
  "Boots of Seal": "/items-icons/armour/armor_t44_b_i00.png",
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
};

export function getItemIcon(itemName: string): string | undefined {
  return itemIcons[itemName];
}

export type ItemCategory =
  | "weapon"
  | "armor"
  | "accessory"
  | "craft"
  | "scroll"
  | "consumable";
export type ItemGrade = "S" | "A" | "B" | "C" | "D" | "none";

// Loot display order: weapons, armor, and jewelry (most valuable) first,
// then the crafting parts that go with them, then enchant scrolls, then
// everything else (potions, dyes, etc.) last.
const CATEGORY_ORDER: Record<ItemCategory, number> = {
  weapon: 0,
  armor: 1,
  accessory: 2,
  craft: 3,
  scroll: 4,
  consumable: 5,
};

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
  if (/_ul_|_u_|tunic|shirt|\bmail\b|\brag\b/.test(haystack)) return 1;
  if (/_l_|gaiters|stocking|hose/.test(haystack)) return 2;
  if (/_g_|glove|gauntlet/.test(haystack)) return 3;
  if (/_b_|boots?/.test(haystack)) return 4;
  if (/^shield_|shield/.test(haystack)) return 5;
  return 6;
}

export function compareDrops(
  a: { item: string },
  b: { item: string },
): number {
  const categoryDiff =
    CATEGORY_ORDER[getItemCategory(a.item)] -
    CATEGORY_ORDER[getItemCategory(b.item)];
  if (categoryDiff !== 0) return categoryDiff;

  const gradeDiff =
    GRADE_ORDER[getItemGrade(a.item)] - GRADE_ORDER[getItemGrade(b.item)];
  if (gradeDiff !== 0) return gradeDiff;

  const slotDiff = getArmorSlotOrder(a.item) - getArmorSlotOrder(b.item);
  if (slotDiff !== 0) return slotDiff;

  return a.item.localeCompare(b.item);
}
