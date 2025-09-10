"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface ContactFormData {
  nome_completo: string
  email: string
  assunto: string
  mensagem: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    nome_completo: "",
    email: "",
    assunto: "",
    mensagem: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage("")

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          nome_completo: "",
          email: "",
          assunto: "",
          mensagem: ""
        })
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      setSubmitStatus('error')
      setErrorMessage('Erro de conexão. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-green-800 font-medium">
            Mensagem enviada com sucesso! Entraremos em contato em breve.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800 font-medium">
            {errorMessage}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome_completo" className="block text-sm font-medium text-slate-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            id="nome_completo"
            name="nome_completo"
            value={formData.nome_completo}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Seu nome completo"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="seu@email.com"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label htmlFor="assunto" className="block text-sm font-medium text-slate-700 mb-2">
          Assunto *
        </label>
        <select
          id="assunto"
          name="assunto"
          value={formData.assunto}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        >
          <option value="">Selecione um assunto</option>
          <option value="parceria">Proposta de Parceria</option>
          <option value="suporte">Suporte Técnico</option>
          <option value="sugestao">Sugestão de Melhoria</option>
          <option value="bug">Reportar Bug</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div>
        <label htmlFor="mensagem" className="block text-sm font-medium text-slate-700 mb-2">
          Mensagem *
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          value={formData.mensagem}
          onChange={handleInputChange}
          required
          rows={6}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Descreva sua mensagem aqui..."
          disabled={isSubmitting}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Enviar Mensagem
          </>
        )}
      </Button>
    </form>
  )
}
