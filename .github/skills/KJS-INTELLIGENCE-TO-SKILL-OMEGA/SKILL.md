---
name: KJS-INTELLIGENCE-TO-SKILL-OMEGA
version: 1.0.0
scope: GPT KJS, Meta KJS, Gemini KJS, Cloud Imperador
language: pt-BR
---

# Skill: KJS Intelligence-to-Skill Ω

## Objetivo
Transformar referências, pesquisas, conversas, vídeos, documentação e sinais de mercado em conhecimento operacional original, verificável, testável e compartilhável. A Skill não copia cursos, textos, frameworks protegidos ou material de terceiros; extrai princípios em alto nível e cria aplicação KJS independente.

## Pipeline obrigatório
1. **Intake:** registrar fonte, autor/canal, URL, data de acesso, tipo de material, objetivo e motivo da seleção.
2. **Acesso e direitos:** usar somente conteúdo acessível legitimamente; respeitar direitos autorais, termos, privacidade e limites da plataforma.
3. **Extração:** resumir teses e métodos em linguagem própria; não reproduzir transcrições, aulas ou sequências extensas.
4. **Classificação:** marcar cada item como FACT, EVIDENCE, INFERENCE, HYPOTHESIS ou PROJECTION.
5. **Verificação:** comparar com fontes independentes e documentação primária; registrar divergências e idade dos dados.
6. **Adaptação KJS:** converter princípios em processos, contratos, componentes, checklists e critérios de aceite originais.
7. **Experimento:** definir baseline, hipótese, amostra, janela, custo, métrica primária, limites e condição de parada.
8. **Codificação:** versionar a Skill somente quando houver instrução reutilizável e teste de consistência; distinguir PREPARED, TESTED, INTEGRATED e PRODUCTION_CONFIRMED.
9. **Distribuição:** usar KJS-MULTI-LLM-HANDOFF; exigir ACK com versão carregada. Sem ACK, status SENT_NOT_CONFIRMED.

## Formato de briefing
- Fonte e timestamp.
- Tese central em palavras próprias.
- Evidências observadas e limitações.
- Princípios transferíveis.
- O que não deve ser copiado/adotado.
- Aplicação concreta ao ecossistema KJS.
- Hipótese e experimento de baixo risco.
- Métricas, custo e critério de sucesso.
- Responsável/núcleo seguinte e ACK esperado.

## Caso de referência: Método VTSD
Canal indicado: https://youtube.com/@vtsd

A identificação do canal e uma amostra de vídeos/transcrições foram obtidas por vidIQ em 03/11/2026. A amostra abordou low-ticket, funil simples e copywriting. Princípios em alto nível para testar:
- Resolver uma tarefa pequena, concreta e aplicável pode tornar um produto de entrada mais claro do que oferecer informação ampla sem uso imediato.
- Começar por um funil simples reduz complexidade e pontos de falha; expandir apenas quando dados reais justificarem.
- Copy clara, simples, específica e concisa facilita compreensão.
- Consistência de produção e análise de feedback devem alimentar a próxima iteração.

Esses princípios são hipóteses de adaptação, não garantias. Métricas de terceiros, depoimentos e prints não são prova de receita KJS. O preço e o escopo de cada produto KJS continuam sujeitos às decisões próprias do operador; não importar automaticamente faixas de preço do canal.

## Caso de referência: GeeLark
Referência oficial de padrões de produto: https://www.geelark.com/pt/recursos/automacao/ e documentação OpenAPI: https://github.com/GeeLark/geelark-openapi/

Padrões abstratos observados: modelos reutilizáveis, orquestração central, sincronização de tarefas, RPA, APIs, biblioteca de ativos, permissões e logs. Aplicação KJS permitida: pipeline de conteúdo próprio com briefing, produção, revisão/aprovação, agendamento autorizado, status de entrega e análise de resultados.

Não implementar automação para spam, engajamento falso, comportamento inautêntico, evasão de limites/controles, ocultação de identidade ou acesso não autorizado. Não presumir que qualquer automação externa esteja integrada.

## ROI e atribuição
ROI 100x é meta aspiracional, não promessa. Para medir:
- separar receita observada de projeção;
- atribuir resultados com origem, timestamp, campanha/conteúdo e janela;
- contabilizar custos diretos e indiretos relevantes, inclusive ferramentas, API, infraestrutura e trabalho;
- comparar com baseline e evitar atribuir causalidade sem desenho de experimento;
- não declarar ROI/ROAS sem dados verificáveis.

## Meta Model API e ferramentas de desenvolvimento
A Meta Model API é uma superfície de inferência; não é a memória do aplicativo Meta AI. Copilot é ferramenta de desenvolvimento, não provedor de hospedagem nem memória compartilhada. Qualquer integração exige documentação oficial atual, autenticação segura, teste de contrato, limites/custos e confirmação de execução. Nunca armazenar chaves em Git, logs ou handoffs.

## Papéis de compartilhamento
- **GPT KJS:** arquitetura da Skill, síntese, critérios de aceite e revisão de código.
- **Meta KJS:** validação de políticas/API Meta e sinais orgânicos autorizados; relatar limites e evidências.
- **Gemini KJS:** pesquisa cruzada, documentação e identificação de contradições com fonte/data.
- **Cloud Imperador:** fonte canônica, versão, IDs, telemetria, decisões e distribuição com ACK.

## Critério de conclusão
Uma fonte só vira aprendizado validado quando as afirmações estão classificadas, a adaptação KJS tem hipótese testável, o experimento tem critério mensurável e o artefato está versionado. Uma Skill publicada no Git não prova que outro núcleo a recebeu ou executou.
