import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { string } from "zod"

interface dataResponse {
    id: string,
    nama: string,
    nama_perusahaan: string,
    key: string
}

interface SelectDudiProps {
    data: dataResponse[] | undefined,
    title: string,
    onChange: (e: string) => void
    value: string | undefined
}


export const SelectSiswa = ({data, title, onChange, value}: SelectDudiProps) => {
    
    return (
        <Select value={value} onValueChange={(e) => onChange(e)} required>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={value ? value : title} />
            </SelectTrigger>
            <SelectContent>
                {data.map((item, index) => (
                    <SelectItem key={index} value={item.id}>{item.nama ? item.nama : item.nama_perusahaan}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}