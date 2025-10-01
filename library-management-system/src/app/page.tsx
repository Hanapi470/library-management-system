'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, User, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Home() {
 const [selectedRole, setSelectedRole] = useState<'siswa' | 'admin'>('siswa')
 const [formData, setFormData] = useState({
 nisn: '',
 password: ''
 })
 const [isLoading, setIsLoading] = useState(false)
 const [error, setError] = useState('')
 const router = useRouter()
 const { toast } = useToast()

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const { name, value } = e.target
 setFormData(prev => ({
 ...prev,
 [name]: value
 }))
 }

 const handleLogin = async (e: React.FormEvent) => {
 e.preventDefault()
 setIsLoading(true)
 setError('')

 try {
 // For admin, validate password
 if (selectedRole === 'admin') {
 if (formData.password !== 'admin123') {
 setError('Password admin salah')
 setIsLoading(false)
 return
 }
 }

 const response = await fetch('/api/auth/login', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify({
 nisn: formData.nisn,
 role: selectedRole
 }),
 })

 const data = await response.json()

 if (response.ok) {
 // Validate role matches
 if (data.user.role.toLowerCase() !== selectedRole) {
 setError(`Akun ini bukan akun ${selectedRole}`)
 setIsLoading(false)
 return
 }

 toast({
 title: "Login berhasil",
 description: `Selamat datang, ${data.user.name}`,
 })

 // Redirect based on role
 if (data.user.role === 'ADMIN') {
 router.push('/admin')
 } else {
 router.push('/siswa')
 }
 } else {
 setError(data.message || 'Login gagal')
 }
 } catch (err) {
 setError('Terjadi kesalahan. Silakan coba lagi.')
 } finally {
 setIsLoading(false)
 }
 }

 return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
 <div className="w-full max-w-md">
 <div className="text-center mb-8">
 <div className="flex items-center justify-center mb-4">
 <BookOpen className="h-12 w-12 text-blue-600 mr-3" />
 <h1 className="text-3xl font-bold text-gray-900">
 Perpustakaan Sekolah
 </h1>
 </div>
 <p className="text-gray-600">
 Sistem manajemen perpustakaan digital
 </p>
 </div>

 <Card>
 <CardHeader>
 <CardTitle>Login</CardTitle>
 <CardDescription>
 Pilih role Anda dan masukkan kredensial
 </CardDescription>
 </CardHeader>
 <CardContent>
 <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'siswa' | 'admin')} className="w-full mb-6">
 <TabsList className="grid w-full grid-cols-2">
 <TabsTrigger value="siswa" className="flex items-center space-x-2">
 <User className="h-4 w-4" />
 <span>Siswa</span>
 </TabsTrigger>
 <TabsTrigger value="admin" className="flex items-center space-x-2">
 <Shield className="h-4 w-4" />
 <span>Admin</span>
 </TabsTrigger>
 </TabsList>
 </Tabs>

 <form onSubmit={handleLogin} className="space-y-4">
 <div className="space-y-2">
 <Label htmlFor="nisn">NISN</Label>
 <Input
 id="nisn"
 name="nisn"
 type="text"
 placeholder="Masukkan NISN"
 value={formData.nisn}
 onChange={handleInputChange}
 required
 />
 </div>

 {selectedRole === 'admin' && (
 <div className="space-y-2">
 <Label htmlFor="password">Password</Label>
 <Input
 id="password"
 name="password"
 type="password"
 placeholder="Masukkan password"
 value={formData.password}
 onChange={handleInputChange}
 required
 />
 <p className="text-xs text-gray-500">
 Default password: admin123
 </p>
 </div>
 )}

 {error && (
 <Alert variant="destructive">
 <AlertDescription>{error}</AlertDescription>
 </Alert>
 )}

 <Button
 type="submit"
 className="w-full"
 disabled={isLoading}
 >
 {isLoading ? 'Memproses...' : `Login sebagai ${selectedRole === 'admin' ? 'Admin' : 'Siswa'}`}
 </Button>
 </form>
 </CardContent>
 </Card>

 <div className="mt-6 text-center text-sm text-gray-600">
 <p>Hubungi admin untuk membuat akun siswa</p>
 {selectedRole === 'admin' && (
 <p className="mt-1 text-xs text-gray-500">
 Gunakan NISN: ADMIN001 dan password: admin123 untuk login admin
 </p>
 )}
 </div>

 <div className="mt-4 text-center">
 <Button
 variant="outline"
 onClick={() => router.push('/products')}
 className="text-sm"
 >
}
