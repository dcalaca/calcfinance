import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Clock, Users, Handshake, MessageSquare, Send } from "lucide-react"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Entre em <span className="text-blue-600">Contato</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Estamos aqui para ajudar você a transformar sua vida financeira. 
            Entre em contato para parcerias, sugestões ou dúvidas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Informações de Contato */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                  Contato Principal
                </CardTitle>
                <CardDescription>
                  Nossa principal forma de comunicação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">E-mail</h3>
                    <p className="text-slate-600">dcalaca@gmail.com</p>
                    <Button asChild size="sm" className="mt-2">
                      <Link href="mailto:dcalaca@gmail.com">
                        <Send className="h-4 w-4 mr-2" />
                        Enviar E-mail
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Horário de Atendimento</h3>
                    <p className="text-slate-600">Segunda a Sexta: 9h às 18h</p>
                    <p className="text-slate-600">Sábado: 9h às 12h</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Localização</h3>
                    <p className="text-slate-600">Brasil - Atendimento Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parcerias */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Handshake className="h-8 w-8 text-green-600" />
                  Parcerias
                </CardTitle>
                <CardDescription>
                  Interessado em uma parceria? Vamos conversar!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Tipos de Parceria</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Conteúdo</Badge>
                      <Badge variant="secondary">Tecnologia</Badge>
                      <Badge variant="secondary">Marketing</Badge>
                      <Badge variant="secondary">Educação</Badge>
                      <Badge variant="secondary">Fintech</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">O que Oferecemos</h4>
                    <ul className="text-slate-600 space-y-1">
                      <li>• Plataforma de calculadoras financeiras</li>
                      <li>• Base de usuários engajados</li>
                      <li>• Conteúdo educacional de qualidade</li>
                      <li>• Tecnologia moderna e escalável</li>
                    </ul>
                  </div>

                  <Button asChild className="w-full">
                    <Link href="mailto:dcalaca@gmail.com?subject=Proposta de Parceria - CalcFinance">
                      <Handshake className="h-4 w-4 mr-2" />
                      Propor Parceria
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário de Contato */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="h-8 w-8 text-purple-600" />
                  Fale Conosco
                </CardTitle>
                <CardDescription>
                  Envie sua mensagem e entraremos em contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>

            {/* FAQ Rápido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-slate-900">Como funciona a parceria?</h4>
                  <p className="text-slate-600 text-sm mt-1">
                    Analisamos cada proposta individualmente e entramos em contato em até 48h.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-slate-900">Posso sugerir novas calculadoras?</h4>
                  <p className="text-slate-600 text-sm mt-1">
                    Sim! Adoramos receber sugestões da nossa comunidade.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-slate-900">Há custos para usar a plataforma?</h4>
                  <p className="text-slate-600 text-sm mt-1">
                    Não! Todas as calculadoras são 100% gratuitas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Pronto para Transformar Suas Finanças?</h3>
            <p className="text-lg mb-6 opacity-90">
              Junte-se à nossa comunidade e comece a tomar decisões financeiras mais inteligentes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                <Link href="/calculadoras">Usar Calculadoras</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/sobre">Conhecer Mais</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
