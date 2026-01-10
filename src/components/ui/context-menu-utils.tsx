import {
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuItem as UIContextMenuItem
} from './context-menu';
import type { ContextMenuItem } from '../../types';

export const renderContextMenuItems = (items: ContextMenuItem[], t: (key: string, params?: any) => string, appName: string, windowId: string) => {
  return items.map((item, index) => {
    if (item.type === 'separator') {
      return <ContextMenuSeparator key={index} />;
    }

    if (item.type === 'submenu') {
      return (
        <ContextMenuSub key={index}>
          <ContextMenuSubTrigger>
            {item.labelKey ? t(item.labelKey, { appName }) : item.label}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {renderContextMenuItems(item.items, t, appName, windowId)}
          </ContextMenuSubContent>
        </ContextMenuSub>
      );
    }

    // Standard Item
    return (
      <UIContextMenuItem
        key={index}
        disabled={item.disabled ?? false}
        variant={item.destructive ? 'destructive' : 'default'}
        onClick={() => {
          if (item.action) {
            window.dispatchEvent(new CustomEvent('app-menu-action', {
              detail: {
                action: item.action,
                appId: appName.toLowerCase(),
                windowId
              }
            }));
          }
        }}
      >
        {item.labelKey ? t(item.labelKey, { appName }) : item.label}
      </UIContextMenuItem>
    );
  });
};
