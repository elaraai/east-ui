### 19. [ ] Menu (`src/overlays/menu.ts`)

**Chakra UI Structure:**
```tsx
<Menu.Root>
  <Menu.Trigger asChild><Button>Open</Button></Menu.Trigger>
  <Menu.Content>
    <Menu.Item value="edit">Edit</Menu.Item>
    <Menu.Separator />
    <Menu.Item value="delete">Delete</Menu.Item>
  </Menu.Content>
</Menu.Root>
```

**East UI Types:**
```typescript
export const MenuItemType = VariantType({
  Item: StructType({
    value: StringType,
    label: StringType,
    disabled: OptionType(BooleanType),
  }),
  Separator: NullType,
});

export const MenuType = StructType({
  trigger: UIComponentType,
  items: ArrayType(MenuItemType),
  placement: OptionType(PlacementType),
});

export const Menu = { Root, Item, Separator } as const;
```

---

