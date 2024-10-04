import cn from 'classnames';
import React, { useState, ChangeEvent, KeyboardEvent, FocusEvent } from 'react';
import './text.css';

interface TextFieldProps {
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  className,
  onFocus,
  onChange,
  onEnter,
}) => {
  const [value, setValue] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);

  const changeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
  };

  const focusHandler = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.();
  };

  const blurHandler = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
  };

  const pressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onEnter?.(value);
    }
  };

  return (
    <input
      type="text"
      className={cn('text-input', className)}
      onChange={changeValue}
      onFocus={focusHandler}
      onBlur={blurHandler}
      onKeyDown={pressEnter}
      placeholder={placeholder || '텍스트를 입력해 주세요.'}
      value={value}
      style={
        focused
          ? { borderWidth: 2, borderColor: 'rgb(25, 118, 210)' }
          : undefined
      }
    />
  );
};

export default TextField;
