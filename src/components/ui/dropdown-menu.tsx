'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import { MoreVertical, Edit, Copy, Trash2 } from 'lucide-react';

interface DropdownMenuItemProps {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function ItemDropdownMenu({ onEdit, onDuplicate, onDelete }: DropdownMenuItemProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 min-w-[180px] z-50"
          sideOffset={5}
        >
          {onEdit && (
            <DropdownMenu.Item
              onClick={onEdit}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
            >
              <Edit className="w-4 h-4" />
              Editar
            </DropdownMenu.Item>
          )}

          {onDuplicate && (
            <DropdownMenu.Item
              onClick={onDuplicate}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
            >
              <Copy className="w-4 h-4" />
              Duplicar
            </DropdownMenu.Item>
          )}

          {(onEdit || onDuplicate) && onDelete && (
            <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
          )}

          {onDelete && (
            <DropdownMenu.Item
              onClick={onDelete}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer outline-none"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
