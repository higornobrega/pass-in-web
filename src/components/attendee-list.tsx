import { Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { attendees } from '../data/attendees'
import { ChangeEvent, useEffect, useState } from 'react'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
    id: string
    name: string
    email: string
    createdAt: string
    checkedInAt: string | null
}

export function AttendeeList() {

    const [seach, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [attendees, setAttendees] = useState<Attendee[]>([])

    const totalPages = Math.ceil(attendees.length / 10)

    useEffect(() => {
        fetch('http://localhost:3000/events/2d24c6d8-d73d-4b41-b0c3-c4928015d5d5/attendees')
            .then(response => response.json())
            .then(data => {
                setAttendees(data.attendees)
            })
    },[page])
    function onSearchInputChange(event:ChangeEvent<HTMLInputElement>) {

        setSearch(event.target.value)
    }

    function goToNextPage() {
        setPage(page + 1)
    }

    function goToPreviusPage() {
        setPage(page - 1)
    }

    function goToFirstPage() {
        setPage(1)
    }

    function goToLastPage() {
        setPage(totalPages)
    }
    return (
        <div className='flex flex-col gap-4'>
            <div className="flex gap-3 items-center">
                <h1 className='text-2xl font-bold'>Participantes</h1>
                <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
                    <Search className='size-4 text-emerald-300' />
                    <input onChange={onSearchInputChange} className="bg-transparent flex-1 outline-none border-0 p-0 text-sm" placeholder="Buscar participantes..." />
                </div>
                {seach}
            </div>
            <Table>
                <thead>
                    <tr className='border-b border-white/10'>
                        <TableHeader style={{ width: 48 }} >
                            <input type="checkbox" className='size-4 bg-black/20 rounded border-white/10' />
                        </TableHeader>
                        <TableHeader >Código</TableHeader>
                        <TableHeader >Participante</TableHeader>
                        <TableHeader >Data de inscrição</TableHeader>
                        <TableHeader >Data do check-in</TableHeader>
                        <TableHeader style={{ width: 64 }} ></TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {attendees.slice((page -1) * 10 ,page * 10).map((attendee) => {
                        return (
                            <TableRow key={attendee.id}>

                                <TableCell>
                                    <input type="checkbox" className='size-4 bg-black/20 rounded border-white/10 accent-orange-400' />
                                </TableCell>
                                <TableCell>{attendee.id}</TableCell>
                                <TableCell>
                                    <div className='flex flex-col gap-1'>
                                        <span className='font-semibold text-white'>{attendee.name}</span>
                                        <span>{attendee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                                <TableCell>{attendee.checkedInAt === null
                                    ? <span className='text-zinc-400'>'Não fez check-in'</span>
                                    : dayjs().to(attendee.checkedInAt)}</TableCell>
                                <TableCell>
                                    <IconButton transparent>
                                        <MoreHorizontal className='size-4' />
                                    </IconButton>
                                    {/* <button className='bg-black/20 border border-white/10 rounded-md p-1.5'>
                                            <MoreHorizontal className='size-4' />
                                        </button> */}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <TableCell  colSpan={3}>
                            Mostrando 10 de {attendees.length} itens
                        </TableCell>
                        <TableCell className='text-right' colSpan={3}>
                            <div className='inline-flex items-center gap-8'>
                                <span>{page} de {totalPages }</span>
                                <div className='flex gap-1.5'>
                                    <IconButton onClick={goToFirstPage} disabled={page===1}>
                                        <ChevronsLeft className='size-4' />
                                    </IconButton>
                                    <IconButton onClick={goToPreviusPage}  disabled={page===1}>
                                        <ChevronLeft className='size-4' />
                                    </IconButton>
                                    <IconButton onClick={goToNextPage} disabled={page===totalPages}>
                                        <ChevronRight className='size-4'  />
                                    </IconButton>
                                    <IconButton onClick={goToLastPage} disabled={page===totalPages}>
                                        <ChevronsRight className='size-4' />
                                    </IconButton>
                                </div>

                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}