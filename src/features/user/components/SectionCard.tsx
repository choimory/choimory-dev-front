import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

/**
 * 콘텐츠 섹션 카드 컴포넌트의 Props
 */
type SectionCardProps = {
  title: string;         // 섹션 제목
  description: string;   // 섹션 설명 문구
  actionLabel: string;   // 동작 버튼 문구
  onAction: () => void;  // 동작 버튼 클릭 시 실행할 동작
};

/**
 * 제목, 설명, 동작 버튼으로 구성된 콘텐츠 섹션 카드 컴포넌트입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 콘텐츠 섹션 카드
 */
export function SectionCard({ title, description, actionLabel, onAction }: SectionCardProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
      <div className="mt-4">
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
}
