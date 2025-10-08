import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { string } from "zod"

interface dataResponse {
    key: string,
    value: string
}

interface SelectDudiProps {
    data: dataResponse[],
    title: string,
    onChange: (e: string) => void
    value: string
}

export const SelectDudi = ({data, title, onChange, value}: SelectDudiProps) => {
    
    return (
        <Select value={value} onValueChange={(e) => onChange(e)} required>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={value ? value : title} />
            </SelectTrigger>
            <SelectContent>
                {data.map((item, index) => (
                    <SelectItem key={index} value={item.value}>{item.key}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}