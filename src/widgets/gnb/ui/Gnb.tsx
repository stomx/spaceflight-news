import { Button } from '@/shared/components/ui/button';
import { Link } from '@tanstack/react-router';

export function Gnb() {
  return (
    <nav className="flex items-center gap-4 bg-background shadow-sm px-6 py-2 border-b">
      <Button asChild variant="ghost" size="sm" className="px-2">
        <Link to="/articles" className="[&.active]:font-bold capitalize">
          Article
        </Link>
      </Button>
      {/* 필요시 추가 메뉴 버튼 */}
    </nav>
  );
}
