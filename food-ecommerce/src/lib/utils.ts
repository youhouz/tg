export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `VAN-${year}${month}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getDeliveryLabel(mode: string): string {
  const labels: Record<string, string> = {
    DOMICILE: 'Livraison a domicile',
    POINT_RELAIS: 'Point relais',
    CLICK_COLLECT: 'Retrait en boutique',
  };
  return labels[mode] || mode;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    EN_ATTENTE: 'En attente',
    CONFIRMEE: 'Confirmee',
    EN_PREPARATION: 'En preparation',
    EXPEDIEE: 'Expediee',
    LIVREE: 'Livree',
    ANNULEE: 'Annulee',
    REMBOURSEE: 'Remboursee',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
    CONFIRMEE: 'bg-blue-100 text-blue-800',
    EN_PREPARATION: 'bg-indigo-100 text-indigo-800',
    EXPEDIEE: 'bg-purple-100 text-purple-800',
    LIVREE: 'bg-green-100 text-green-800',
    ANNULEE: 'bg-red-100 text-red-800',
    REMBOURSEE: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
