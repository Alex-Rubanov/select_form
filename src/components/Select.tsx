import { useState, useEffect } from 'react'
import styles from '../select.module.css'

type SelectOption = {
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
      if (value.includes(option)) onChange(value.filter(opt => opt !== option))
    } else {
      if (option !== value) onChange(option)
    }
  }
  const isOptionSelected = (option: SelectOption) => option === value
  const isOptionHighlited = (index: number) => setHighlightedIndex(index)

  useEffect(() => {
    setHighlightedIndex(0)
  }, [isOpen])

  return (
    <div
      tabIndex={0}
      className={styles.container}
      onClick={() => setIsOpen(prev => !prev)}
      onBlur={closeOptionsMenu}
      onKeyDown={e => {
        if (e.key === 'Escape') closeOptionsMenu()
      }}
    >
      <span className={styles.value}>{value?.label}</span>
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
