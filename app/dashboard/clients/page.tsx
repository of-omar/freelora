"use client"

import { useEffect, useState } from "react"

import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"

import {
  Badge,
} from "@/components/ui/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const statusStyles = {
  Active: "bg-green-500/10 text-green-500 border-green-500/20",
  Inactive: "bg-muted text-muted-foreground border-border",
}

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const [clients, setClients] = useState<any[]>([])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")

  const [editingClient, setEditingClient] = useState<any>(null)

  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editCompany, setEditCompany] = useState("")
  const [editPhone, setEditPhone] = useState("")

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await api.get("/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setClients(res.data)

      } catch (err) {
        console.error("Clients error:", err)
      }
    }

    fetchClients()
  }, [])

  const handleAddClient = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await api.post(
        "/clients",
        {
          name,
          email,
          company,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setClients((prev: any) => [res.data, ...prev])

      setDialogOpen(false)

      setName("")
      setEmail("")
      setCompany("")
      setPhone("")

    } catch (err) {
      console.error("Add client error:", err)
      alert("Failed to add client")
    }
  }

  const handleDeleteClient = async (id: number) => {
    try {
      const token = localStorage.getItem("token")

      await api.delete(`/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setClients((prev) =>
        prev.filter((client) => client.id !== id)
      )

    } catch (err) {
      console.error("Delete client error:", err)
      alert("Failed to delete client")
    }
  }

  const openEditDialog = (client: any) => {
    setEditingClient(client)

    setEditName(client.name || "")
    setEditEmail(client.email || "")
    setEditCompany(client.company || "")
    setEditPhone(client.phone || "")
  }

  const handleEditClient = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await api.patch(
        `/clients/${editingClient.id}`,
        {
          name: editName,
          email: editEmail,
          company: editCompany,
          phone: editPhone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setClients((prev: any) =>
        prev.map((client: any) =>
          client.id === editingClient.id
            ? res.data
            : client
        )
      )

      setEditingClient(null)

    } catch (err) {
      console.error("Edit client error:", err)
      alert("Failed to edit client")
    }
  }

  const filteredClients = clients.filter((client) => {
    return (
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Clients
          </h1>

          <p className="text-muted-foreground mt-1">
            Manage your client relationships and contact information.
          </p>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">

            <DialogHeader>
              <DialogTitle>
                Add New Client
              </DialogTitle>

              <DialogDescription>
                Enter the client information.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">

              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="clientName">
                    Name
                  </Label>

                  <Input
                    id="clientName"
                    placeholder="Client name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">
                    Company
                  </Label>

                  <Input
                    id="company"
                    placeholder="Company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone
                  </Label>

                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location
                  </Label>

                  <Input
                    id="location"
                    placeholder="City, State"
                  />
                </div>

              </div>

            </div>

            <DialogFooter>

              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button onClick={handleAddClient}>
                Add Client
              </Button>

            </DialogFooter>

          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingClient}
        onOpenChange={() => setEditingClient(null)}
      >
        <DialogContent className="sm:max-w-[500px]">

          <DialogHeader>
            <DialogTitle>
              Edit Client
            </DialogTitle>

            <DialogDescription>
              Update client information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">

            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label>Name</Label>

                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Company</Label>

                <Input
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                />
              </div>

            </div>

            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>

              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setEditingClient(null)}
            >
              Cancel
            </Button>

            <Button onClick={handleEditClient}>
              Save Changes
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>

      {/* Search */}
      <div className="relative max-w-md">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />

      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">

        <Table>

          <TableHeader>

            <TableRow className="bg-muted/50 hover:bg-muted/50">

              <TableHead>
                Client
              </TableHead>

              <TableHead className="hidden md:table-cell">
                Contact
              </TableHead>

              <TableHead className="hidden lg:table-cell">
                Location
              </TableHead>

              <TableHead className="text-center">
                Projects
              </TableHead>

              <TableHead>
                Revenue
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead className="w-[50px]" />

            </TableRow>

          </TableHeader>

          <TableBody>

            {filteredClients.map((client) => (

              <TableRow key={client.id}>

                <TableCell>

                  <div className="flex items-center gap-3">

                    <Avatar className="h-9 w-9">

                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">

                        {client.name?.slice(0, 2).toUpperCase()}

                      </AvatarFallback>

                    </Avatar>

                    <div>

                      <div className="font-medium text-foreground">
                        {client.name}
                      </div>

                      <div className="text-sm text-muted-foreground flex items-center gap-1">

                        <Building2 className="h-3 w-3" />

                        {client.company || "No company"}

                      </div>

                    </div>

                  </div>

                </TableCell>

                <TableCell className="hidden md:table-cell">

                  <div className="space-y-1">

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">

                      <Mail className="h-3 w-3" />

                      {client.email}

                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">

                      <Phone className="h-3 w-3" />

                      {client.phone || "No phone"}

                    </div>

                  </div>

                </TableCell>

                <TableCell className="hidden lg:table-cell">

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">

                    <MapPin className="h-3 w-3" />

                    {client.location || "Unknown"}

                  </div>

                </TableCell>

                <TableCell className="text-center">
                  <span className="font-medium text-foreground">
                    0
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-medium text-foreground">
                    $0
                  </span>
                </TableCell>

                <TableCell>

                  <Badge
                    variant="outline"
                    className={cn(
                      statusStyles[
                        "Active" as keyof typeof statusStyles
                      ]
                    )}
                  >
                    Active
                  </Badge>

                </TableCell>

                <TableCell>

                  <DropdownMenu>

                    <DropdownMenuTrigger asChild>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >

                        <MoreHorizontal className="h-4 w-4" />

                      </Button>

                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                      <DropdownMenuItem
                        onClick={() => openEditDialog(client)}
                      >

                        <Edit className="h-4 w-4 mr-2" />

                        Edit

                      </DropdownMenuItem>

                      <DropdownMenuItem>

                        <Mail className="h-4 w-4 mr-2" />

                        Send Email

                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteClient(client.id)}
                      >

                        <Trash2 className="h-4 w-4 mr-2" />

                        Delete

                      </DropdownMenuItem>

                    </DropdownMenuContent>

                  </DropdownMenu>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (

        <div className="text-center py-12">

          <p className="text-muted-foreground">
            No clients found matching your search.
          </p>

        </div>

      )}

    </div>
  )
}