import { Heart, Folder, Clock, MapPin, User, Image, Grid3x3, List } from 'lucide-react';
import { AppTemplate } from './AppTemplate';
import { ResponsiveGrid } from '../ui/ResponsiveGrid';
import { useAppStorage } from '../../hooks/useAppStorage';
import { cn } from '../ui/utils';

const photosSidebar = {
  sections: [
    {
      title: 'Library',
      items: [
        { id: 'all', label: 'All Photos', icon: Image, badge: '1,234' },
        { id: 'favorites', label: 'Favorites', icon: Heart, badge: '42' },
        { id: 'recent', label: 'Recent', icon: Clock },
        { id: 'people', label: 'People', icon: User },
        { id: 'places', label: 'Places', icon: MapPin },
      ],
    },
    {
      title: 'Albums',
      items: [
        { id: 'album1', label: 'Vacation 2024', icon: Folder, badge: '156' },
        { id: 'album2', label: 'Family', icon: Folder, badge: '89' },
        { id: 'album3', label: 'Nature', icon: Folder, badge: '203' },
      ],
    },
  ],
};

const mockPhotos = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  color: ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500', 'bg-teal-500'][i % 6],
}));

export function Photos() {
  // Persisted state
  const [appState, setAppState] = useAppStorage('photos', {
    activeCategory: 'all',
    viewMode: 'grid',
  });

  const toolbar = (
    <div className="flex items-center justify-between w-full">
      <h2 className="text-white/90">All Photos</h2>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setAppState(s => ({ ...s, viewMode: 'grid' }))}
          className={cn(
            "p-1.5 rounded transition-colors",
            appState.viewMode === 'grid' ? "bg-white/10 text-white" : "hover:bg-white/10 text-white/70"
          )}
        >
          <Grid3x3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setAppState(s => ({ ...s, viewMode: 'list' }))}
          className={cn(
            "p-1.5 rounded transition-colors",
            appState.viewMode === 'list' ? "bg-white/10 text-white" : "hover:bg-white/10 text-white/70"
          )}
        >
          <List className="w-4 h-4 text-white/70" />
        </button>
      </div>
    </div>
  );

  const content = (
    <div className="p-4">
      <ResponsiveGrid minItemWidth={140} gap={3}>
        {mockPhotos.map((photo) => (
          <div
            key={photo.id}
            className={`aspect-square ${photo.color} rounded-lg hover:scale-105 transition-transform cursor-pointer`}
          />
        ))}
      </ResponsiveGrid>
    </div >
  );

  return (
    <AppTemplate
      sidebar={photosSidebar}
      toolbar={toolbar}
      content={content}
      activeItem={appState.activeCategory}
      onItemClick={(id) => setAppState(s => ({ ...s, activeCategory: id }))}
      contentClassName="overflow-y-auto"
      minContentWidth={500}
    />
  );
}
