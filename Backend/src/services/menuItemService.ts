import {
  MenuItemRepository,
  type CreateMenuItemInput,
} from '../repositories/menuItemRepository.ts';

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;

  constructor(
    menuItemRepository: MenuItemRepository = new MenuItemRepository()
  ) {
    this.menuItemRepository = menuItemRepository;
  }

  async getAllMenuItems() {
    return await this.menuItemRepository.findAll();
  }

  async getMenuItemById(id: number) {
    const menuItem = await this.menuItemRepository.findById(id);

    if (!menuItem) {
      throw new Error('MENU_ITEM_NOT_FOUND');
    }

    return menuItem;
  }

  async createMenuItem(input: CreateMenuItemInput) {
    return await this.menuItemRepository.create(input);
  }

  async updateMenuItem(
    id: number,
    input: Partial<CreateMenuItemInput>
  ) {
    const menuItem = await this.menuItemRepository.update(id, input);

    if (!menuItem) {
      throw new Error('MENU_ITEM_NOT_FOUND');
    }

    return menuItem;
  }

  async deleteMenuItem(id: number) {
    const menuItem = await this.menuItemRepository.remove(id);

    if (!menuItem) {
      throw new Error('MENU_ITEM_NOT_FOUND');
    }

    return menuItem;
  }
}