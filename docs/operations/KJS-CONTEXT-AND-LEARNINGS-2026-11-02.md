# KJS — Consolidação de contexto e aprendizados
**Data:** 02/11/2026  
**Versão da fonte operacional:** 1.1.0  
**Skill de resolução:** AUTONOMOUS-RESOLUTION-OMEGA 1.2.0  
**Skill de interoperabilidade:** KJS-MULTI-LLM-HANDOFF 1.0.0

## 1. Síntese executiva
KJS IMPERATOR Ω é um ecossistema proprietário de Growth, aquisição orgânica, inteligência, produtos digitais e SaaS. A governança é centralizada no Cloud Imperador; os quatro núcleos externos colaboram por contratos versionados e handoffs verificáveis. O operador mantém autoridade decisória.

O protocolo universal permanece:
**COMANDO → EXECUÇÃO → CONCLUSÃO → APRENDIZADO → MANIFESTO.**

## 2. Decisões vigentes
- Identidade e camada de governança: KJS.
- KJS_PLATFORM é o contrato canônico de inferência; Claude é referência funcional, não provedor soberano.
- OpenAI, Anthropic e OpenRouter podem existir como adaptadores externos de teste/compatibilidade, sem se tornarem o núcleo proprietário.
- Três LLMs centrais: KJSIMPERADOR, ALPHA e BETA.
- Doze especialistas do Conselho: ADM, GOV, INT, STR, MKT, PRD, OFR, COM, DST, CVR, FIN e LAC.
- GPT KJS, Meta KJS, Gemini KJS e Cloud Imperador são quatro núcleos operacionais externos; não são equivalentes à contagem dos agentes internos.
- Aquisição atual é orgânica; não presumir mídia paga.
- Marketplace deve comercializar fabricação própria, sem white-label ou afiliados. A arquitetura está especificada, não certificada como produto implementado.
- Mercado Pago descartado. Hotmart não é requisito de fabricação. Trial definido em sete dias, sem cartão, com e-mail e WhatsApp.
- Dados de produção exigem origem, timestamp, ambiente, identificador único e validação; testes e sandbox ficam segregados.

## 3. Estado técnico verificado nesta revisão
### Governança
O repositório KAMILLO-4531, branch feat/crm-kanban-evidence, está 27 commits à frente e zero atrás de main. Os documentos de governança foram revisados nesta branch; main não foi alterada.

### Runtime privado
Há duas linhas experimentais não reconciliadas:
- Linha KJS_PLATFORM/Conselho: 36 commits à frente e 46 atrás de main; PR #10 aberto, Draft e mergeable=false. O código define três LLMs centrais e doze especialistas. Endpoint KJS real, segredo do host, Render, health check, login e deploy não foram confirmados.
- Linha runtime OpenRouter: oito commits à frente e zero atrás de main; quatro perfis LLM e adaptador OpenRouter. É protótipo separado e não representa o Conselho de doze especialistas. O próprio documento de setup informa que não inclui endpoint HTTP de agentes, fila persistente, scheduler, ferramentas externas, memória de longo prazo, painel de observabilidade, testes automatizados ou deploy.

A consulta de workflows associada aos dois heads não retornou execuções. Isso não substitui a verificação de CI completa. Nenhum teste foi executado nesta revisão.

## 4. Dúvidas esclarecidas
1. Memória entre provedores não é automática: a fonte versionada e o ACK de cada núcleo são necessários.
2. Claude não é a identidade do provedor KJS; KJS_PLATFORM é o contrato canônico.
3. Os doze especialistas, os três LLMs centrais e os quatro núcleos externos pertencem a camadas diferentes.
4. O runtime de quatro perfis/OpenRouter é um protótipo separado; não deve ser fundido sem reconciliação.
5. Heartbeat de oito minutos e rotinas de três/seis horas são requisitos de arquitetura, não serviços confirmados.
6. Documento, código, teste, integração, CI, deploy, health check e certificação são estados distintos.

## 5. Conhecimento a compartilhar
- GPT KJS: decompor tarefas, manter arquitetura, revisar diffs, critérios de aceite e evidência.
- Meta KJS: devolver fontes públicas autorizadas, resultados de aquisição orgânica, eventos e limitações de API; não alegar publicação ou integração sem resposta da plataforma.
- Gemini KJS: pesquisa, validação cruzada, documentação Google e identificação de contradições com fonte/data.
- Cloud Imperador: manter fonte canônica, IDs de handoff, versões, ACKs, decisões, telemetria real e relatório KJS STATUS Ω.
- Todos: preservar LGPD, consentimento, minimização, acesso mínimo, segregação de ambientes e não divulgação de segredos.

## 6. Ações prioritárias
1. Criar uma branch limpa a partir da base aprovada e reconciliar seletivamente as duas linhas do runtime; não fazer merge integral da branch divergente.
2. Preservar KJS_PLATFORM como identidade; testar o contrato em endpoint real somente após configurar secrets no host.
3. Executar testes, CI e revisão de segurança antes de PR/merge.
4. Confirmar Render, persistência, health check e login. SQLite em /tmp é efêmero e não garante retenção.
5. Implementar handoff com ACK, contexto versionado e idempotência; até isso existir, distribuição entre provedores é documental, não automática.
6. Tratar arquivos .env rastreados no fluxo privado: rotacionar qualquer credencial real antes de remover arquivos e histórico.
7. Implementar scheduler, fila, workers, limites de custo, kill switch e observabilidade antes de declarar operação 24/7.
8. Implementar marketplace por etapas e manter status de especificação até evidência de funcionamento.

## 7. Critérios de verdade
- NÃO VERIFICADO: sem resposta de sistema, teste ou leitura de volta.
- PREPARADO: código/documentação criados, sem integração externa comprovada.
- TESTADO: comando de teste executado, com resultado registrado.
- INTEGRADO: sistema externo confirmou a conexão/recebimento.
- PUBLICADO: URL/versão pública confirmada.
- CERTIFICADO: todos os critérios operacionais e de segurança aprovados.

**Comando de consulta:** KJS STATUS Ω.
