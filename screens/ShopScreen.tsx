import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/colors';
import { useGame } from '../context/GameContext';
import { StarGemsDisplay } from '../components/StarGemsDisplay';
import { OUTFITS, ROOM_ITEMS, BACKGROUNDS } from '../constants/shopData';
import { PippyOutfit, RoomItem, Background } from '../types';

type ShopCategory = 'outfits' | 'room' | 'backgrounds';
type SubCategory = string;

const RARITY_COLORS = {
  common: Colors.rarityCommon,
  rare: Colors.rarityRare,
  epic: Colors.rarityEpic,
  legendary: Colors.rarityLegendary,
};

export const ShopScreen: React.FC = () => {
  const { wallet, shop, purchaseItem, spendStarGems } = useGame();
  const [category, setCategory] = useState<ShopCategory>('outfits');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const getItems = () => {
    switch (category) {
      case 'outfits':
        return OUTFITS;
      case 'room':
        return ROOM_ITEMS;
      case 'backgrounds':
        return BACKGROUNDS;
      default:
        return [];
    }
  };

  const isOwned = (itemId: string) => {
    switch (category) {
      case 'outfits':
        return shop.ownedOutfits.includes(itemId);
      case 'room':
        return shop.ownedRoomItems.includes(itemId);
      case 'backgrounds':
        return shop.ownedBackgrounds.includes(itemId);
      default:
        return false;
    }
  };

  const handlePurchase = () => {
    if (!selectedItem) return;
    
    const type = category === 'outfits' ? 'outfit' : 
                 category === 'room' ? 'roomItem' : 'background';
    
    const success = purchaseItem(type, selectedItem.id, selectedItem.price);
    
    if (success) {
      setShowPurchaseModal(false);
      setSelectedItem(null);
      // Show success feedback
      Alert.alert('🎉 Purchased!', `You got ${selectedItem.name}!`);
    } else {
      Alert.alert('Not enough gems!', 'Complete tasks to earn more Star Gems ⭐');
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const owned = isOwned(item.id);
    const canAfford = wallet.starGems >= item.price;
    
    return (
      <TouchableOpacity
        style={[
          styles.itemCard,
          owned && styles.itemOwned,
          !owned && !canAfford && styles.itemCantAfford,
        ]}
        onPress={() => {
          if (!owned) {
            setSelectedItem(item);
            setShowPurchaseModal(true);
          }
        }}
        disabled={owned}
      >
        {/* Rarity indicator */}
        <View style={[styles.rarityBadge, { backgroundColor: RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS] }]} />
        
        {/* Item preview */}
        <View style={styles.itemPreview}>
          <Text style={styles.itemEmoji}>
            {category === 'outfits' ? '👗' : 
             category === 'room' ? '🏠' : '🖼️'}
          </Text>
        </View>
        
        {/* Item info */}
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        
        {/* Price or owned badge */}
        {owned ? (
          <View style={styles.ownedBadge}>
            <Text style={styles.ownedText}>Owned ✓</Text>
          </View>
        ) : (
          <View style={[styles.priceTag, !canAfford && styles.priceTagCantAfford]}>
            <Text style={styles.priceText}>⭐ {item.price}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with currency */}
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        <StarGemsDisplay amount={wallet.starGems} size="large" />
      </View>

      {/* Category tabs */}
      <View style={styles.tabs}>
        {(['outfits', 'room', 'backgrounds'] as ShopCategory[]).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, category === cat && styles.tabActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.tabText, category === cat && styles.tabTextActive]}>
              {cat === 'outfits' ? '👗 Outfits' : 
               cat === 'room' ? '🏠 Room' : '🖼️ Themes'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Items grid */}
      <FlatList
        data={getItems()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.gridRow}
      />

      {/* Purchase modal */}
      <Modal
        visible={showPurchaseModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                  <View style={[styles.modalRarity, { backgroundColor: RARITY_COLORS[selectedItem.rarity as keyof typeof RARITY_COLORS] }]}>
                    <Text style={styles.modalRarityText}>
                      {selectedItem.rarity.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.modalPreview}>
                  <Text style={styles.modalEmoji}>
                    {category === 'outfits' ? '👗' : 
                     category === 'room' ? '🏠' : '🖼️'}
                  </Text>
                </View>
                
                <View style={styles.modalPrice}>
                  <Text style={styles.modalPriceLabel}>Price:</Text>
                  <StarGemsDisplay amount={selectedItem.price} size="medium" />
                </View>
                
                <View style={styles.modalBalance}>
                  <Text style={styles.modalBalanceLabel}>Your balance:</Text>
                  <Text style={[
                    styles.modalBalanceAmount,
                    wallet.starGems < selectedItem.price && styles.modalBalanceInsufficient
                  ]}>
                    ⭐ {wallet.starGems.toLocaleString()}
                  </Text>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowPurchaseModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.modalBuyButton,
                      wallet.starGems < selectedItem.price && styles.modalBuyButtonDisabled
                    ]}
                    onPress={handlePurchase}
                    disabled={wallet.starGems < selectedItem.price}
                  >
                    <Text style={styles.modalBuyText}>
                      {wallet.starGems >= selectedItem.price ? 'Buy Now' : 'Not Enough'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primaryLight,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primaryDark,
  },
  grid: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 120,
  },
  gridRow: {
    gap: Spacing.md,
  },
  itemCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...Shadows.md,
    position: 'relative',
    overflow: 'hidden',
  },
  itemOwned: {
    opacity: 0.7,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  itemCantAfford: {
    opacity: 0.5,
  },
  rarityBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  itemPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  priceTag: {
    backgroundColor: Colors.starGemGlow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  priceTagCantAfford: {
    backgroundColor: Colors.errorLight,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accentDark,
  },
  ownedBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  ownedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 340,
    ...Shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  modalRarity: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  modalRarityText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textOnPrimary,
    letterSpacing: 1,
  },
  modalPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  modalEmoji: {
    fontSize: 56,
  },
  modalPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalPriceLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  modalBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  modalBalanceLabel: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  modalBalanceAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  modalBalanceInsufficient: {
    color: Colors.error,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.border,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modalBuyButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalBuyButtonDisabled: {
    backgroundColor: Colors.border,
  },
  modalBuyText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textOnPrimary,
  },
});
