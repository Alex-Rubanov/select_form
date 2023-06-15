import { useState, useEffect, useRef, KeyboardEventHandler } from 'react'
import styles from '../select.module.css'

export type SelectOption = {
  label: string
  value: number | string
}

type MultipleSelectProps = {
  multiple: true
  value: SelectOption[]
  onChange: (value: SelectOption[]) => void
}

type SingleSelectProps = {
  multiple?: false
  value?: SelectOption
  onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
  options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

const Select = ({ multiple, value, onChange, options }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const clearOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    multiple ? onChange([]) : onChange(undefined)
  }

  const closeOptionsMenu = () => setIsOpen(false)

  const selectOption = (option: SelectOption) => {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter(opt => opt !== option))
      } else {
        onChange([...value, option])
      }
    } else {
      if (option !== value) onChange(option)
    }
  }

  const isOptionSelected = (option: SelectOption) => {
    return multiple ? value.includes(option) : option === value
  }

  const isOptionHighlited = (index: number) => setHighlightedIndex(index)

  useEffect(() => {
    setHighlightedIndex(0)
  }, [isOpen])

  const handler = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'Enter':
      case 'Space':
        setIsOpen(prev => !prev)

        if (isOpen) selectOption(options[highlightedIndex])
        break
      case 'ArrowUp':
      case 'ArrowDown':
        if (!isOpen) {
          setIsOpen(true)
          break
        }

        const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1)

        if (newValue >= 0 && newValue < options.length) {
          setHighlightedIndex(newValue)
          break
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={handler}
      className={styles.container}
      onClick={() => setIsOpen(prev => !prev)}
      onBlur={closeOptionsMenu}
    >
      <span className={styles.value}>
        {multiple
          ? value.map(v => (
              <button
                key={v.value}
                onClick={e => {
                  e.stopPropagation()
                  selectOption(v)
                }}
                className={styles['option-badge']}
              >
                {v.label}
                <span className={styles['remove-btn']}>&times;</span>
              </button>
            ))
          : value?.label}
      </span>
      <button className={styles['clear-btn']} onClick={clearOptions}>
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
        {options.map((option, index) => (
          <li
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ''
            } ${highlightedIndex === index ? styles.highlighted : ''}`}
            key={option.label}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation()
              selectOption(option)
              closeOptionsMenu()
            }}
            onMouseEnter={() => isOptionHighlited(index)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Select
