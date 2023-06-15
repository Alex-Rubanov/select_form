import { useState } from 'react'
import Select, { SelectOption } from './components/Select'

const options = [
  { label: 'First', value: 1 },
  { label: 'Second', value: 2 },
  { label: 'Third', value: 3 },
  { label: 'Fourth', value: 4 },
  { label: 'Fifth', value: 5 }
]

const App = () => {
  const [value, setValue] = useState<SelectOption[]>([options[0]])
  const [value2, setValue2] = useState<SelectOption | undefined>(options[0])

  return (
    <div>
      <Select
        multiple
        options={options}
        value={value}
        onChange={option => setValue(option)}
      />
      <Select
        options={options}
        value={value2}
        onChange={option => setValue2(option)}
      />
    </div>
  )
}

export default App
