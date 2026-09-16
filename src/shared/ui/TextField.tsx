'use client';

/** 입력 필드에서 허용하는 입력 유형 */
export type TextFieldType = 'text' | 'email' | 'password';

/**
 * 라벨과 입력 필드를 함께 렌더링하는 컴포넌트의 Props
 */
type TextFieldProps = {
  id: string;                        // 입력 필드 고유 식별자
  label: string;                     // 입력 필드 라벨 문구
  value: string;                     // 현재 입력 값
  onChange: (value: string) => void; // 입력 값 변경 시 실행할 동작
  name?: string;                     // form 전송 시 사용할 필드명. 미지정 시 id를 사용한다
  type?: TextFieldType;              // 입력 유형
  placeholder?: string;              // 입력 안내 문구
  isRequired?: boolean;              // 필수 입력 여부
  isDisabled?: boolean;              // 비활성화 여부
  actionLabel?: string;              // 입력 필드 우측 버튼 문구. 중복확인 등에 사용한다
  onAction?: () => void;             // 우측 버튼 클릭 시 실행할 동작
};

/** 입력 필드 공통 스타일 */
const INPUT_CLASS_NAME =
  'px-4 py-3 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white';

/**
 * 라벨과 입력 필드를 함께 표시하는 공통 입력 컴포넌트입니다.
 * `actionLabel`을 전달하면 입력 필드 우측에 보조 버튼을 함께 렌더링합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 라벨과 입력 필드를 포함한 요소
 */
export function TextField({
  id,
  label,
  value,
  onChange,
  name,
  type = 'text',
  placeholder,
  isRequired = false,
  isDisabled = false,
  actionLabel,
  onAction,
}: TextFieldProps) {
  // 보조 버튼이 있는 경우 입력 필드의 우측 모서리를 직각으로 처리한다.
  const hasAction = Boolean(actionLabel);
  const radiusClassName = hasAction ? 'rounded-l-lg flex-grow' : 'rounded-lg w-full';

  const input = (
    <input
      id={id}
      name={name ?? id}
      type={type}
      value={value}
      placeholder={placeholder}
      required={isRequired}
      disabled={isDisabled}
      onChange={(event) => onChange(event.target.value)}
      className={`${INPUT_CLASS_NAME} ${radiusClassName}`}
    />
  );

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      {hasAction ? (
        <div className="flex">
          {input}
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-3 border-t border-b border-r border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-r-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {actionLabel}
          </button>
        </div>
      ) : (
        input
      )}
    </div>
  );
}
