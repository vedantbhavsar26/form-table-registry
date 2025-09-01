'use client';

import { useForm } from 'react-hook-form';
import { Form } from '@/lib/form-field/form';
import { FormItem } from '@/lib/form-field/formItem';
import { fieldComponents } from '@/lib/form-field/registry';
import {
  Home,
  User,
  Users,
  Settings,
  Search,
  Bell,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  Folder,
  Book,
  Camera,
  Music,
  Video,
  Image,
  Map,
  Globe,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Package,
  Truck,
  Heart,
  Star,
  Shield,
  Lock,
  Cpu,
  Code,
} from 'lucide-react';
import { baseOption, OptionType } from '@/lib/form-field/form-field';

const opts: baseOption[] = [
  { label: 'Home', value: 'home', icon: Home },
  { label: 'Profile', value: 'profile', icon: User },
  { label: 'Team', value: 'team', icon: Users },
  { label: 'Settings', value: 'settings', icon: Settings },
  { label: 'Search', value: 'search', icon: Search },
  { label: 'Notifications', value: 'notifications', icon: Bell },
  { label: 'Messages', value: 'messages', icon: Mail },
  { label: 'Calls', value: 'calls', icon: Phone },
  { label: 'Calendar', value: 'calendar', icon: Calendar },
  { label: 'Time', value: 'time', icon: Clock },
  { label: 'Documents', value: 'documents', icon: FileText },
  { label: 'Folders', value: 'folders', icon: Folder },
  { label: 'Library', value: 'library', icon: Book },
  { label: 'Camera', value: 'camera', icon: Camera },
  { label: 'Music', value: 'music', icon: Music },
  { label: 'Videos', value: 'videos', icon: Video },
  { label: 'Images', value: 'images', icon: Image },
  { label: 'Map', value: 'map', icon: Map },
  { label: 'World', value: 'world', icon: Globe },
  { label: 'Cart', value: 'cart', icon: ShoppingCart },
  { label: 'Payments', value: 'payments', icon: CreditCard },
  { label: 'Finance', value: 'finance', icon: DollarSign },
  { label: 'Inventory', value: 'inventory', icon: Package },
  { label: 'Delivery', value: 'delivery', icon: Truck },
  { label: 'Favorites', value: 'favorites', icon: Heart },
  { label: 'Ratings', value: 'ratings', icon: Star },
  { label: 'Security', value: 'security', icon: Shield },
  { label: 'Privacy', value: 'privacy', icon: Lock },
  { label: 'Hardware', value: 'hardware', icon: Cpu },
  { label: 'Code', value: 'code', icon: Code },
].map((e) => ({ ...e, count: Math.floor(Math.random() * 100) }));

export function FormPanel() {
  const form = useForm();

  const keys = Object.keys(fieldComponents);

  const options = {
    select: {
      options: async (q) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (q) return opts.filter((e) => e.label.includes(q));
        return opts;
      },
    },
    combobox: {
      options: async (q) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (q) return opts.filter((e) => e.label.toLowerCase().startsWith(q.toLowerCase()));
        return [];
      },
    },
    suggest: {
      options: async (q) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (q) return opts.filter((e) => e.label.toLowerCase().startsWith(q.toLowerCase()));
        return [];
      },
      shouldCloseOnNoItems: true,
    },
    toggle: {
      options: async (q) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (q) return opts.filter((e) => e.label.includes(q));
        return opts;
      },
    },
  } satisfies Partial<
    Record<
      keyof typeof fieldComponents,
      {
        options: OptionType;
        shouldCloseOnNoItems?: boolean;
      }
    >
  >;

  return (
    <Form {...form} className={'mx-auto container grid grid-cols-3 gap-2 py-20'}>
      {keys.map((key, index) => (
        <FormItem
          key={key}
          control={form.control}
          name={key}
          // @ts-expect-error type error
          render={key}
          props={options[key as never]}
        />
      ))}
    </Form>
  );
}

export default function Page() {
  return (
    <>
      <FormPanel />
    </>
  );
}
