/**
 * ============================================
 * HEARTWARMING — CARDS E FERRAMENTAS
 * scriptcards.js
 * ============================================
 * Este arquivo centraliza todas as funcionalidades
 * dos painéis de detalhes dos personagens:
 *   1. Busca de Lojas (iFood, Rappi, Marketplace)
 *   2. Gerador de Comunicado (E-mail de entrega)
 *   3. Etiqueta Manual (Entrega Turbo / D+1)
 *   4. Sistema XLSX (Financeiro)
 *   5. Sistema de Etiquetas (Notas Fiscais / Colantes)
 * ============================================ */


// ============================================
// 1. BUSCA DE LOJAS (iFood, Rappi, Marketplace)
// ============================================

const PHARM_DATA = [
{"Java":"6","Farmácia":"SP PAULISTA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"01311-100","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"07:00 as 23:00","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"7","Farmácia":"SÃO CARLOS A","Bandeira":"RAIA","Cidade":"SAO CARLOS","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"13560-010","Nuvem Transportadora":"07:00 as 19:00","SEG A SEX":"07:00 as 20:00","SAB":"07:00 as 20:00","DOM":"07:00 as 20:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"8","Farmácia":"ARARAQUARA A","Bandeira":"RAIA","Cidade":"ARARAQUARA","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"14801-295","Nuvem Transportadora":"07:00 as 19:00","SEG A SEX":"07:00 as 20:00","SAB":"07:00 as 20:00","DOM":"07:00 as 20:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"9","Farmácia":"SP FREGUESIA DO Ó A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"02731-000","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"07:00 as 23:00","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"13","Farmácia":"PRAIA GRANDE A","Bandeira":"RAIA","Cidade":"PRAIA GRANDE","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"11701-000","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"07:00 as 23:00","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"15","Farmácia":"RIO CLARO A","Bandeira":"RAIA","Cidade":"RIO CLARO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"13500-160","Nuvem Transportadora":"08:00 as 21:00","SEG A SEX":"07:00 as 23:00","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"16","Farmácia":"ITU A","Bandeira":"RAIA","Cidade":"ITU","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"13300-055","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"17","Farmácia":"SÃO VICENTE A","Bandeira":"RAIA","Cidade":"SAO VICENTE","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"11310-061","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"07:00 as 23:00","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"18","Farmácia":"GUARUJÁ D","Bandeira":"RAIA","Cidade":"GUARUJA","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"11450-001","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"07:00 as 23:00","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"19","Farmácia":"SP BROOKLIN A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"04621-001","Nuvem Transportadora":"07:00 as 02:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"20","Farmácia":"SP PENHA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"03606-010","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"07:00 as 23:00","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"21","Farmácia":"SP PINHEIROS A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"05406-150","Nuvem Transportadora":"09:00 as 21:00","SEG A SEX":"07:00 as 23:00","SAB":"07:00 as 23:00","DOM":"07:00 as 21:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"23","Farmácia":"SP SUMAREZINHO B","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"05438-300","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"24","Farmácia":"SP ALTO DA LAPA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"05061-350","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"07:00 as 23:00","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"25","Farmácia":"SP ALTO PINHEIROS A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"LEILÃO","Modelo de operação":"HÍBRIDA","CEP":"05461-000","Nuvem Transportadora":"08:00 as 22:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"26","Farmácia":"S JOSÉ RIO PRETO A","Bandeira":"RAIA","Cidade":"SAO JOSE DO RIO PRETO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"15010-060","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"27","Farmácia":"RIBEIRÃO PRETO A","Bandeira":"RAIA","Cidade":"RIBEIRAO PRETO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"14015-170","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"29","Farmácia":"SP ITAIM BIBI A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"04535-002","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"30","Farmácia":"SP VILA OLIMPIA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"04537-012","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"31","Farmácia":"LIMEIRA A","Bandeira":"RAIA","Cidade":"LIMEIRA","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"13480-041","Nuvem Transportadora":"07:00 as 21:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"32","Farmácia":"CP CENTRO A","Bandeira":"RAIA","Cidade":"CAMPINAS","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"13010-081","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Segunda a Sabado","SAB":"07:00 as 20:00","DOM":"Fechado","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"34","Farmácia":"RJ TIJUCA A","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"20260-142","Nuvem Transportadora":"07:00 as 01:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"35","Farmácia":"MARILIA A","Bandeira":"RAIA","Cidade":"MARILIA","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"17500-021","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"36","Farmácia":"GUARUJÁ A","Bandeira":"RAIA","Cidade":"GUARUJA","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"11410-190","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"37","Farmácia":"CUBATÃO A","Bandeira":"RAIA","Cidade":"CUBATAO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"11510-000","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"40","Farmácia":"FRANCA A","Bandeira":"RAIA","Cidade":"FRANCA","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"14400-690","Nuvem Transportadora":"08:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"42","Farmácia":"SP VL N CONCEIÇÃO A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"04511-001","Nuvem Transportadora":"07:00 as 05:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"43","Farmácia":"SP REPUBLICA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"01046-001","Nuvem Transportadora":"08:00 as 21:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 22:00","DOM":"07:00 as 22:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"44","Farmácia":"SP MOEMA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"04077-021","Nuvem Transportadora":"07:00 as 03:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"45","Farmácia":"SP FARIA LIMA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"01452-001","Nuvem Transportadora":"08:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"06:20 as 23:00","DOM":"06:20 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"46","Farmácia":"SP PERDIZES A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"05013-000","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"47","Farmácia":"SP TUCURUVI A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"02341-000","Nuvem Transportadora":"07:00 as 03:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"49","Farmácia":"CP CENTRO B","Bandeira":"RAIA","Cidade":"CAMPINAS","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"13012-000","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 21:00","DOM":"07:00 as 21:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"53","Farmácia":"SP ALT BOA VISTA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"04715-003","Nuvem Transportadora":"07:00 as 03:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"54","Farmácia":"SP TATUAPE A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"03323-000","Nuvem Transportadora":"07:00 as 02:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"57","Farmácia":"SP SAUDE A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"04046-200","Nuvem Transportadora":"07:00 as 21:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 22:00","DOM":"07:00 as 21:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"58","Farmácia":"SP BUTANTA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"05503-000","Nuvem Transportadora":"07:00 as 02:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"60","Farmácia":"ALPHAVILLE A","Bandeira":"RAIA","Cidade":"BARUERI","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"06454-001","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"61","Farmácia":"SP HIGIENOPOLIS A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"01228-100","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"62","Farmácia":"SP VILA BUARQUE A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"01222-010","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"63","Farmácia":"PRAIA GRANDE B","Bandeira":"RAIA","Cidade":"PRAIA GRANDE","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"11704-220","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"66","Farmácia":"SP VILA PRUDENTE A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"03126-050","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"67","Farmácia":"SP VILA SONIA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"05512-300","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"69","Farmácia":"SP VL CLEMENTINO A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"04036-000","Nuvem Transportadora":"07:00 as 05:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"73","Farmácia":"ST BOQUEIRÃO A","Bandeira":"RAIA","Cidade":"SANTOS","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"11055-011","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"74","Farmácia":"GUARULHOS A","Bandeira":"RAIA","Cidade":"GUARULHOS","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"07011-010","Nuvem Transportadora":"08:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"76","Farmácia":"SP VL ANDRADE A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"05724-003","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"77","Farmácia":"SP JD PAULISTA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"01423-001","Nuvem Transportadora":"07:00 as 05:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"78","Farmácia":"SP CERQ CESAR B","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"01411-001","Nuvem Transportadora":"07:00 as 03:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"81","Farmácia":"SP PARAISO B","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"04007-005","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"82","Farmácia":"SP PIRITUBA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"02936-000","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 22:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"84","Farmácia":"GUARULHOS B","Bandeira":"RAIA","Cidade":"GUARULHOS","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"07111-120","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"85","Farmácia":"SP CASA VERDE A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"02022-010","Nuvem Transportadora":"07:00 as 00:30","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"86","Farmácia":"RJ IPANEMA A","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"22410-003","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"87","Farmácia":"RJ LEBLON A","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"22440-032","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"88","Farmácia":"RJ COPACABANA A","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"22060-001","Nuvem Transportadora":"07:00 as 01:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"90","Farmácia":"SP MOEMA B","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"04522-033","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"91","Farmácia":"RJ COPACABANA B","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"22020-001","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 22:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"93","Farmácia":"S J DOS CAMPOS A","Bandeira":"RAIA","Cidade":"SAO JOSE DOS CAMPOS","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"12245-010","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"95","Farmácia":"RJ COPACABANA D","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"22021-010","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"96","Farmácia":"GRANJA VIANA A","Bandeira":"RAIA","Cidade":"COTIA","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"06709-015","Nuvem Transportadora":"07:00 as 21:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"97","Farmácia":"CP CAMBUI B","Bandeira":"RAIA","Cidade":"CAMPINAS","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"13025-063","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"98","Farmácia":"RJ COPACABANA C","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"22050-001","Nuvem Transportadora":"07:00 as 21:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 22:00","DOM":"07:00 as 22:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"99","Farmácia":"RJ LEBLON B","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"22440-034","Nuvem Transportadora":"07:00 as 01:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"100","Farmácia":"SP BROOKLIN NOVO A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"04560-010","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"101","Farmácia":"RJ GAVEA A","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"22451-040","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"103","Farmácia":"RJ BARRA TIJUCA B","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"22793-081","Nuvem Transportadora":"07:00 as 01:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"104","Farmácia":"SP VL LEOPOLDINA A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"05302-001","Nuvem Transportadora":"07:00 as 03:00","SEG A SEX":"Todos os dias","SAB":"24hs","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"106","Farmácia":"SP VL S FRANCISCO A","Bandeira":"RAIA","Cidade":"SAO PAULO","UF":"SP","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"05351-000","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"108","Farmácia":"RJ MEIER A","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"20720-012","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"109","Farmácia":"RJ REC DOS BAND A","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"22790-701","Nuvem Transportadora":"07:00 as 01:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"112","Farmácia":"CT CENTRO A","Bandeira":"RAIA","Cidade":"CURITIBA","UF":"PR","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"80020-320","Nuvem Transportadora":"07:00 as 19:40","SEG A SEX":"Segunda a Sabado","SAB":"07:00 as 20:40","DOM":"Fechado","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"113","Farmácia":"BH LOURDES A","Bandeira":"RAIA","Cidade":"BELO HORIZONTE","UF":"MG","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"30170-122","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"},
{"Java":"114","Farmácia":"RJ ILH GOVERNADOR A","Bandeira":"RAIA","Cidade":"RIO DE JANEIRO","UF":"RJ","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"21931-370","Nuvem Transportadora":"07:00 as 23:00","SEG A SEX":"24hs","SAB":"24hs","DOM":"24hs","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"SIM"},
{"Java":"116","Farmácia":"BH GUTIERREZ A","Bandeira":"RAIA","Cidade":"BELO HORIZONTE","UF":"MG","Situação":"PRODUÇÃO","Transportadora Turbo":"UBER","Leadtime Turbo":"60 Minutos","Definição TMS":"PADRÃO","Modelo de operação":"HÍBRIDA","CEP":"30441-025","Nuvem Transportadora":"07:00 as 22:00","SEG A SEX":"Todos os dias","SAB":"07:00 as 23:00","DOM":"07:00 as 23:00","Antibióticos":"SIM","Psicotrópicos":"SIM","Termolábeis":"NÃO"}
];

const WORKFLOW_DATA = [
{"category":"Integração/Início","items":["DATA DA VENDA","PRE ORDER","INTEGRADO NO OMS","VALIDAÇÃO DO PEDIDO","ENRIQUECIMENTO ITEM CONTROLADO","CÁLCULO DO PRAZO DE ENTREGA","ENRIQUECIMENTO PEDIDO EXPRESSO","IDENTIFICA CONTROLADOS","ERRO NA VALIDAÇÃO DE PEDIDOS CADASTRADOS"]},
{"category":"Pagamento","items":["AGUARDANDO CONFIRMAÇÃO DO PAGAMENTO","PAGAMENTO CONFIRMADO","PRONTO PARA PAGAMENTO","AGUARDANDO VALIDAÇÃO DE RECEITA MÉDICA","RECEITA MÉDICA VALIDADA COM SUCESSO","VERIFICA NECESSIDADE DE APROVAÇÃO DA RECEITA","VERIFICA NECESSIDADE DE CAPTURA","AGUARDANDO CAPTURA DO PAGAMENTO","CAPTURA CONFIRMADA PELO GATEWAY","CAPTURA NEGADA PELO GATEWAY","AGUARDANDO RETORNO DA CAPTURA DO PAGAMENTO","RECEITA MÉDICA REJEITADA"]},
{"category":"Análise de Crédito","items":["AGUARDANDO ANÁLISE DE CRÉDITO","AGUARDANDO RETORNO DA ANÁLISE DE CRÉDITO","APROVADO PELA ANÁLISE DE CRÉDITO","PRONTO PARA ANÁLISE","ERRO AO ENVIAR PARA ANÁLISE DE RISCO","REPROVADO PELA ANÁLISE DE CRÉDITO"]},
{"category":"Separação","items":["PRONTO PARA SEPARAÇÃO DE MERCADORIAS","VERIFICA NECESSIDADE DE ALOCAR TRANSPORTADORA","AGUARDANDO ALOCAÇÃO DE TRANSPORTADORA","AGUARDANDO RETORNO DA ALOCAÇÃO DA TRANSPORTADORA","SOLICITA SEPARAÇÃO DE MERCADORIAS","AGUARDANDO SEPARAÇÃO DE MERCADORIAS","PEDIDO SEPARADO","AGUARDANDO ESTOQUE","AGUARDANDO RETORNO DA SEPARAÇÃO DE MERCADORIAS","BACKORDER GERADO","PEDIDO FATURADO PARCIALMENTE","ERRO NA SEPARAÇÃO","PEDIDO CONGELADO","PEDIDO DESCONGELADO"]},
{"category":"Faturamento","items":["PRONTO PARA FATURAR","AGUARDANDO FATURAMENTO","AGUARDANDO RETORNO DA EMISSÃO DA NOTA FISCAL","NOTA EMITIDA","SOLICITAÇÃO DE LIBERAÇÃO DE ESTOQUE","ENVIO PBM","NOTIFICAÇÃO NF CONTROLADOS","ERRO NA EMISSÃO DA NOTA FISCAL","NOTA EMITIDA. PRONTO PARA IMPRESSÃO","AGUARDANDO RETORNO DA IMPRESSÃO DE ETIQUETAS","ERRO NA IMPRESSÃO DE ETIQUETAS","ERRO NA INUTILIZAÇÃO DA NOTA","ERRO NO FATURAMENTO","FATURADO","PRONTO FATURAMENTO","PEDIDO SEPARADO. AGUARDANDO FATURAMENTO NO TC","AGUARDANDO COLETA DE RECEITA MÉDICA","ERRO AO SOLICITAR COLETA DE RECEITA MÉDICA","AGUARDANDO CHEGADA DE RECEITA MÉDICA","RECEITA MÉDICA RECEBIDA","AGUARDANDO APROVAÇÃO DE RECEITA MÉDICA","RECEITA MEDICA APROVADA COM SUCESSO","RECEITA MÉDICA REPROVADA","AGUARDANDO NOTA DE DEVOLUÇÃO"]},
{"category":"Entregue","items":["ENTREGUE","DESPACHADO","EM PROCESSO DE ENTREGA","ENTREGUE BSL","ENTREGUE COM SUCESSO","ENTREGUE CORREIOS","ENTREGUE DIRECT","ENTREGUE GSL","ENTREGUE SERVCOM","ENTREGUE TOTAL EXPRESS","PROBLEMA ENTREGA","DEVOLUÇÃO","PEDIDO DEVOLVIDO"]},
{"category":"Cancelamento","items":["CANCELADO","AGUARDANDO CANCELAMENTO","AGUARDANDO CANCELAMENTO DA PRE-AUTORIZAÇÃO","PRONTO PARA CANCELAMENTO EXTERNO","AGUARDANDO RETORNO DO CANCELAMENTO","CANCELAMENTO NEGADO","AGUARDANDO CANCELAMENTO DE NOTA FISCAL","AGUARDANDO RETORNO DO CANCELAMENTO DA NOTA FISCAL","AGUARDANDO CANCELAMENTO DO PEDIDO","ERRO NO CANCELAMENTO","CANCELADO CLIENTE","CANCELADO RAIA"]}
];

function esc(s) { const div = document.createElement('div'); div.textContent = s; return div.innerHTML; }
function showNotification(message) { const n = document.createElement('div'); n.textContent = message; n.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--green-800);color:#fff;padding:12px 24px;border-radius:12px;font-size:13px;font-weight:500;z-index:4000;box-shadow:0 8px 24px rgba(0,0,0,0.15);white-space:nowrap;'; document.body.appendChild(n); setTimeout(() => { n.style.opacity='0'; n.style.transition='opacity 0.3s'; setTimeout(()=>n.remove(),300); }, 2500); }
function copyToClipboard(text) { navigator.clipboard.writeText(text).then(() => { showNotification('Copiado: ' + text.substring(0,40) + (text.length>40?'...':'')); }).catch(() => { const ta = document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showNotification('Copiado!'); }); }


// ============================================
// 3. ETIQUETA MANUAL (Entrega Turbo / D+1)
// ============================================

function gerarEtiqueta() {
  const numeroPedido = document.getElementById('numeroPedido')?.value || '';
  const codigoDestino = document.getElementById('codigoDestino')?.value || '';
  const tipoSolicitacao = document.getElementById('tipoSolicitacao')?.value || '';
  const endereco = document.getElementById('endereco')?.value || '';
  const nf = document.getElementById('nf')?.value || '';
  const quantidade = document.getElementById('quantidade')?.value || '';
  const codigoRastreio = document.getElementById('codigoRastreio')?.value || '';
  const cliente = document.getElementById('cliente')?.value || '';
  const motorista = document.getElementById('motorista')?.value || '';
  const unidadeNegocio = document.getElementById('unidadeNegocio')?.value || '';
  const observacao = document.getElementById('observacao')?.value || '';

  if (!numeroPedido || !endereco || !cliente) {
    alert('Por favor, preencha o numero do pedido, endereco e nome do cliente.');
    return;
  }

  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Template de etiqueta HTML
  const safe = value => esc(String(value ?? ''));
  const etiquetaHTML = `
    <div class="etiqueta">
      <div class="etiqueta-header">Protocolo de Despacho</div>
      <div class="ficha-header">FICHA DE DESPACHO</div>
      <div class="info-row">
        <div class="info-cell"><strong>Data:</strong> ${data}</div>
        <div class="info-cell"><strong>Hora:</strong> ${hora}</div>
      </div>
      <div class="pedido-info">
        <div class="pedido-cell pedido-numero"><strong>Pedido:</strong> ${safe(numeroPedido)}</div>
        <div class="pedido-cell"><strong>Codigo Destino:</strong> ${safe(codigoDestino)}</div>
        <div class="pedido-cell"><strong>Tipo:</strong> ${safe(tipoSolicitacao)}</div>
        <div class="pedido-cell"><strong>NF:</strong> ${safe(nf)}</div>
        <div class="pedido-cell"><strong>Qtd:</strong> ${safe(quantidade)}</div>
        <div class="pedido-cell"><strong>Rastreio:</strong> ${safe(codigoRastreio)}</div>
      </div>
      <div class="envio-section">ORDEM DE ENVIO - ${tipoSolicitacao.toUpperCase()}</div>
      <div class="solicitacao-row">
        <strong>Cliente:</strong> ${safe(cliente)}<br>
        <strong>Motorista:</strong> ${safe(motorista || 'Nao informado')}<br>
        <strong>Unidade de Negocio:</strong> ${safe(unidadeNegocio || 'Nao informada')}
      </div>
      <div class="endereco-row">
        <strong>Endereco de Entrega:</strong><br>
        ${safe(endereco)}
      </div>
      <div class="instrucoes-section">
        <div class="instrucoes-title">INSTRUCOES:</div>
        Favor realizar o despacho conforme as informacoes acima. Verificar a integridade dos itens antes do envio.
      </div>
      <div class="atencao-section">
        <strong>ATENCAO:</strong> Em caso de divergencia, entrar em contato imediatamente com a central.
      </div>
      <div class="romaneio-header">ROMANEIO DE DESPACHO</div>
      <div class="tabela-container">
        <div class="tabela-header">
          <div class="tabela-col">Pedido</div>
          <div class="tabela-col">NF</div>
          <div class="tabela-col">Rastreio</div>
          <div class="tabela-col">Cliente</div>
        </div>
        <div class="tabela-row">
          <div class="tabela-cell">${safe(numeroPedido)}</div>
          <div class="tabela-cell">${safe(nf)}</div>
          <div class="tabela-cell">${safe(codigoRastreio)}</div>
          <div class="tabela-cell">${safe(cliente)}</div>
        </div>
      </div>
      <div class="assinatura-section">
        <div class="assinatura-row">
          <div class="assinatura-label">Assinatura do Responsavel:</div>
          <div class="assinatura-linha"></div>
        </div>
        <div class="assinatura-row">
          <div class="assinatura-label">Data e Hora:</div>
          <div class="assinatura-linha">${data} - ${hora}</div>
        </div>
        <div class="assinatura-row">
          <div class="assinatura-label">Assinatura do Motorista:</div>
          <div class="assinatura-linha"></div>
        </div>
      </div>
      ${observacao ? `<div class="instrucoes-section"><strong>OBSERVACAO:</strong> ${observacao}</div>` : ''}
    </div>`;

  document.getElementById('etiquetaPreview').innerHTML = etiquetaHTML;
  document.getElementById('etiquetaContainer').style.display = 'block';
}

async function gerarPDF() {
  const preview = document.getElementById('etiquetaPreview');
  const loading = document.getElementById('loading');
  const btnGerarPDF = document.getElementById('btnGerarPDF');

  if (!preview || !preview.innerHTML.trim()) {
    alert('Por favor, gere a etiqueta primeiro antes de criar o PDF.');
    return;
  }

  if (loading) loading.style.display = 'inline-block';
  if (btnGerarPDF) {
    btnGerarPDF.disabled = true;
    btnGerarPDF.textContent = 'Gerando PDF...';
  }

  try {
    if (!window.jspdf || !window.html2canvas) {
      throw new Error('Bibliotecas de PDF não carregadas.');
    }
    const canvas = await html2canvas(preview, { backgroundColor: '#ffffff', scale: 3, useCORS: true });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = 210;
    const imageWidth = 190;
    const imageHeight = canvas.height * imageWidth / canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imageWidth, Math.min(imageHeight, 277));
    const pedido = document.getElementById('numeroPedido')?.value || 'manual';
    pdf.save(`etiqueta-${pedido}.pdf`);
  } catch (error) {
    console.error('Erro ao gerar PDF da etiqueta:', error);
    alert('Não foi possível gerar o PDF. Verifique sua conexão e tente novamente.');
  } finally {
    if (loading) loading.style.display = 'none';
    if (btnGerarPDF) {
      btnGerarPDF.disabled = false;
      btnGerarPDF.innerHTML = '<i class="fas fa-file-pdf"></i> Gerar PDF <span class="loading" id="loading"><span class="spinner"></span></span>';
    }
  }
}

function limparFormulario() {
  const form = document.getElementById('etiquetaForm');
  const preview = document.getElementById('etiquetaPreview');
  const container = document.getElementById('etiquetaContainer');
  if (form) {
    form.querySelectorAll('input, textarea, select').forEach(field => {
      if (field.tagName === 'SELECT') {
        field.selectedIndex = 0;
      } else if (field.type === 'number') {
        field.value = field.defaultValue || '';
      } else {
        field.value = '';
      }
    });
  }
  if (preview) preview.innerHTML = '';
  if (container) container.style.display = 'none';
}


// ============================================
// 4. SISTEMA XLSX (Financeiro)
// ============================================

const COLUMNS = ['cd_televenda', 'ds_status', 'dt_entrega', 'cd_proprietaria', 'mensageria'];
const defaults = {
  ds_status: '',
  dt_entrega: '',
  cd_proprietaria: '1255',
  mensageria: 'N'
};
let pedidos = [];
let statusAtual = '';
let modoAtual = 'individual';
let msgIndividual = false;
let msgMassa = false;

// ---- Selecao de status ----
function setStatus(el) {
  if (!el) return;
  document.querySelectorAll('.gx-pill').forEach(p => {
    if (p.dataset.status) {
      p.className = 'gx-pill';
      if (p.id === 'pill-extra') {
        p.classList.add('gx-pill-extra');
      }
    }
  });
  const st = el.dataset.status;
  if (st === 'ENTREGUE') el.classList.add('gx-pill--green');
  else if (st === 'CANCELADO') el.classList.add('gx-pill--red');
  else el.classList.add('gx-pill--blue');
  statusAtual = st;
  closeDropdown();
  document.getElementById('extraLabel').textContent = 'OUTROS STATUS';
  document.getElementById('extraDropdownWrap').classList.remove('gx-dropdown--open');
  document.getElementById('pill-extra').className = 'gx-pill gx-pill-extra';
  updateGenButton();
}

function setExtraStatus(el) {
  if (!el) return;
  const st = el.dataset.status;
  statusAtual = st;
  document.querySelectorAll('.gx-pill').forEach(p => {
    if (p.dataset.status) { p.className = 'gx-pill'; if (p.id === 'pill-extra') p.classList.add('gx-pill-extra'); }
  });
  const pe = document.getElementById('pill-extra');
  pe.className = 'gx-pill gx-pill-extra gx-pill--blue';
  document.getElementById('extraLabel').textContent = st;
  document.getElementById('extraDropdownWrap').classList.add('gx-dropdown--open');
  updateGenButton();
  closeDropdown();
}

// ---- Dropdown ----
function toggleDropdown() {
  document.getElementById('dropdownList').classList.toggle('gx-dd-list--open');
  document.getElementById('ddArrow').classList.toggle('gx-dd-arrow--open');
}

function closeDropdown() {
  document.getElementById('dropdownList').classList.remove('gx-dd-list--open');
  document.getElementById('ddArrow').classList.remove('gx-dd-arrow--open');
}

// ---- Tabs ----
function setMode(mode) {
  modoAtual = mode;
  document.getElementById('tab-individual').className = mode === 'individual' ? 'gx-tab gx-tab--active' : 'gx-tab';
  document.getElementById('tab-massa').className = mode === 'massa' ? 'gx-tab gx-tab--active' : 'gx-tab';
  document.getElementById('panel-individual').style.display = mode === 'individual' ? 'block' : 'none';
  document.getElementById('panel-massa').style.display = mode === 'massa' ? 'block' : 'none';
  document.getElementById('defaultsRow').classList.toggle('gx-defaults-row--show', mode === 'massa');
}

// ---- Toggle mensageria ----
function toggleMsg() {
  msgIndividual = !msgIndividual;
  const t = document.getElementById('msgToggle');
  const l = document.getElementById('msgLabel');
  if (t) t.classList.toggle('gx-toggle--on', msgIndividual);
  if (l) l.textContent = msgIndividual ? 'Sim (s)' : 'Nao (n)';
}

function toggleMassaMsg() {
  msgMassa = !msgMassa;
  const t = document.getElementById('mMsgToggle');
  const l = document.getElementById('mMsgLabel');
  if (t) t.classList.toggle('gx-toggle--on', msgMassa);
  if (l) l.textContent = msgMassa ? 'Sim (s)' : 'Nao (n)';
}

// ---- Add pedido ----
function addPedido() {
  const cd = document.getElementById('f_cd').value.trim();
  if (!cd) { showToast('Preencha cd_televenda.'); return; }
  if (!statusAtual) { showToast('Selecione um status.'); return; }
  const dtVal = document.getElementById('f_dt').value;
  let dt = '';
  if (dtVal) {
    const d = new Date(dtVal);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    dt = `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }
  pedidos.push({
    cd_televenda: cd,
    ds_status: statusAtual,
    dt_entrega: dt || defaults.dt_entrega,
    cd_proprietaria: defaults.cd_proprietaria,
    mensageria: msgIndividual ? 'S' : 'N'
  });
  document.getElementById('f_cd').value = '';
  document.getElementById('f_dt').value = '';
  msgIndividual = false;
  const t = document.getElementById('msgToggle');
  t.classList.remove('gx-toggle--on');
  document.getElementById('msgLabel').textContent = 'Nao (n)';
  renderList();
  updateGenButton();
  showToast('Pedido adicionado!');
}

// ---- Add em massa ----
function addMassa() {
  const raw = document.getElementById('massaInput').value.trim();
  if (!raw) { showToast('Cole os pedidos primeiro.'); return; }
  if (!statusAtual) { showToast('Selecione um status.'); return; }

  const defaultDt = document.getElementById('m_dt').value;
  let defaultDtFormatted = '';
  if (defaultDt) {
    const d = new Date(defaultDt);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    defaultDtFormatted = `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }
  const defaultMsg = msgMassa ? 'S' : 'N';

  const lines = raw.split(/\n/).map(l => l.trim()).filter(Boolean);
  let added = 0;

  for (const line of lines) {
    if (line.includes(';')) {
      const parts = line.split(';').map(p => p.trim());
      const cd = parts[0];
      if (!cd) continue;
      const dt = parts[1] || defaultDtFormatted || defaults.dt_entrega;
      const msg = parts[2] ? (parts[2].toUpperCase() === 'S' ? 'S' : 'N') : defaultMsg;
      pedidos.push({
        cd_televenda: cd,
        ds_status: statusAtual,
        dt_entrega: dt,
        cd_proprietaria: defaults.cd_proprietaria,
        mensageria: msg
      });
      added++;
    } else {
      const cd = line;
      if (!cd) continue;
      pedidos.push({
        cd_televenda: cd,
        ds_status: statusAtual,
        dt_entrega: defaultDtFormatted || defaults.dt_entrega,
        cd_proprietaria: defaults.cd_proprietaria,
        mensageria: defaultMsg
      });
      added++;
    }
  }

  document.getElementById('massaInput').value = '';
  renderList();
  updateGenButton();
  showToast(`${added} pedido(s) adicionado(s)!`);
}

function updateGenButton() {
  document.getElementById('genBtn').disabled = !(pedidos.length > 0 && statusAtual);
}

// ---- Render lista ----
function renderList() {
  const list = document.getElementById('pedidosList');
  document.getElementById('countLabel').textContent = pedidos.length;
  if (!pedidos.length) { list.innerHTML = '<p class="gx-no-pedidos">Nenhum pedido adicionado ainda.</p>'; return; }
  list.innerHTML = pedidos.map((p, i) => `
    <div class="gx-order-card">
      <div class="gx-order-num">${i + 1}.</div>
      <div class="gx-order-cd">${p.cd_televenda}</div>
      <div class="gx-order-dt">${p.dt_entrega || '-'}</div>
      ${p.mensageria === 'S' ? '<div class="gx-order-msg">Msg</div>' : ''}
      <button class="gx-order-del" onclick="removePedido(${i})">&#x2715;</button>
    </div>
  `).join('');
}

function removePedido(i) { pedidos.splice(i, 1); renderList(); updateGenButton(); }

// ---- Gerar XLSX ----
function gerarXLSX() {
  if (!pedidos.length) { showToast('Adicione pelo menos um pedido.'); return; }
  if (typeof XLSX === 'undefined') { showToast('Biblioteca XLSX não carregada.'); return; }
  const data = pedidos.map(p => ({
    cd_televenda: p.cd_televenda,
    ds_status: p.ds_status,
    dt_entrega: p.dt_entrega,
    cd_proprietaria: p.cd_proprietaria,
    mensageria: p.mensageria
  }));
  const ws = XLSX.utils.json_to_sheet(data, { header: COLUMNS });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  XLSX.writeFile(wb, `pedidos_${ts}.xlsx`);
  showToast('Arquivo XLSX gerado!');
}

function limparTudo() { pedidos = []; renderList(); updateGenButton(); showToast('Lista limpa.'); }

// ---- Toast ----
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('gx-toast--show');
  setTimeout(() => t.classList.remove('gx-toast--show'), 2500);
}


// ============================================
// 5. SISTEMA DE ETIQUETAS (Notas Fiscais/Colantes)
// ============================================
// Gerador profissional de etiquetas com QR Code
// e Código de Barras. Preview em tempo real.
// ============================================

class LabelGenerator {
    constructor() {
        this.elements = this.initElements();
        if (!this.elements.preview || !this.elements.generateBtn) return;
        this.codeCounter = 0;
        this.totalGenerated = 0;
        this.bindEvents();
        this.syncOrderToCode();
        this.updateStats();
    }

    initElements() {
        return {
            codeType: document.getElementById('labelCodeType'),
            orderNumber: document.getElementById('labelOrderNumber'),
            codeText: document.getElementById('labelCodeText'),
            recipientName: document.getElementById('labelRecipientName'),
            recipientAddress: document.getElementById('labelRecipientAddress'),
            senderInfo: document.getElementById('labelSenderInfo'),
            barWidth: document.getElementById('labelBarWidth'),
            barHeight: document.getElementById('labelBarHeight'),
            widthValue: document.getElementById('labelWidthValue'),
            heightValue: document.getElementById('labelHeightValue'),
            preview: document.getElementById('labelPreview'),
            message: document.getElementById('labelMessage'),
            totalGenerated: document.getElementById('labelTotalGenerated'),
            generateBtn: document.getElementById('labelGenerateBtn'),
            clearBtn: document.getElementById('labelClearBtn'),
            downloadBtn: document.getElementById('labelDownloadBtn')
        };
    }

    bindEvents() {
        this.elements.generateBtn.addEventListener('click', () => this.generate());

        ['codeType', 'orderNumber', 'recipientName', 'recipientAddress', 'senderInfo'].forEach(id => {
            if (this.elements[id]) {
                this.elements[id].addEventListener(id === 'codeType' ? 'change' : 'input', () => this.generate());
            }
        });

        if (this.elements.codeText) this.elements.codeText.addEventListener('input', () => this.generate());

        if (this.elements.barWidth) {
            this.elements.barWidth.addEventListener('input', (e) => {
                if (this.elements.widthValue) this.elements.widthValue.textContent = e.target.value;
                this.generate();
            });
        }

        if (this.elements.barHeight) {
            this.elements.barHeight.addEventListener('input', (e) => {
                if (this.elements.heightValue) this.elements.heightValue.textContent = e.target.value;
                this.generate();
            });
        }

        if (this.elements.clearBtn) this.elements.clearBtn.addEventListener('click', () => this.clear());
        if (this.elements.downloadBtn) this.elements.downloadBtn.addEventListener('click', () => this.downloadPDF());
    }

    syncOrderToCode() {
        this.elements.orderNumber.addEventListener('input', () => {
            if (!this.elements.codeText.value.trim() || this.elements.codeText.value === this.elements.orderNumber.dataset.lastValue) {
                this.elements.codeText.value = this.elements.orderNumber.value;
            }
            this.elements.orderNumber.dataset.lastValue = this.elements.orderNumber.value;
        });
    }

    updateStats() {
        this.elements.totalGenerated.textContent = this.totalGenerated;
    }

    showMessage(text, type = 'info') {
        this.elements.message.innerHTML = `<div class="label-message ${type}">${text}</div>`;
    }

    generateCode(text, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return false;

        container.innerHTML = '';
        const isBarcode = this.elements.codeType.value === 'barcode';
        this.codeCounter++;

        if (isBarcode) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.id = `barcode-${this.codeCounter}`;
            container.appendChild(svg);

            try {
                JsBarcode(svg, text, {
                    format: 'CODE128',
                    displayValue: true,
                    width: Number(this.elements.barWidth.value),
                    height: Number(this.elements.barHeight.value),
                    margin: 6,
                    fontSize: 10,
                    background: '#ffffff',
                    lineColor: '#000000'
                });
                return true;
            } catch {
                this.showMessage('Erro no código de barras.', 'error');
                return false;
            }
        } else {
            const qrDiv = document.createElement('div');
            qrDiv.id = `qr-${this.codeCounter}`;
            container.appendChild(qrDiv);

            try {
                new QRCode(qrDiv, {
                    text: text,
                    width: 120,
                    height: 120,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.M
                });
                return true;
            } catch {
                this.showMessage('Erro ao gerar QR Code.', 'error');
                return false;
            }
        }
    }

    createLabel() {
        const data = {
            orderNumber: this.elements.orderNumber.value || 'SEM NÚMERO',
            codeText: this.elements.codeText.value || this.elements.orderNumber.value || 'VAZIO',
            recipientName: this.elements.recipientName.value || 'DESTINATÁRIO NÃO INFORMADO',
            recipientAddress: this.elements.recipientAddress.value || 'Endereço não informado',
            senderInfo: this.elements.senderInfo.value || 'Remetente não informado'
        };

        return `
            <div class="label-shipping-label">
                <div class="label-header">
                    <div class="label-pedido-label">PEDIDO Nº</div>
                    <div class="label-pedido-number">${esc(data.orderNumber)}</div>
                </div>
                <div class="label-body">
                    <div class="label-code-section" id="label-code-container"></div>
                    <div class="label-info-section">
                        <div class="label-info-title"> DESTINATÁRIO</div>
                        <div class="label-info-content">
                            <div class="label-recipient-name">${esc(data.recipientName)}</div>
                            <div>${esc(data.recipientAddress).replace(/\n/g, '<br>')}</div>
                        </div>
                    </div>
                    <div class="label-info-section">
                        <div class="label-info-title"> REMETENTE</div>
                        <div class="label-info-content">${esc(data.senderInfo)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    generate() {
        this.elements.preview.innerHTML = '';

        const labelHTML = this.createLabel();
        this.elements.preview.innerHTML = labelHTML;

        const codeText = this.elements.codeText.value || this.elements.orderNumber.value;

        if (codeText && this.generateCode(codeText, 'label-code-container')) {
            this.showMessage('Etiqueta gerada com sucesso!', 'success');
            this.totalGenerated++;
            this.updateStats();
        } else {
            this.showMessage('Erro ao gerar código.', 'error');
        }
    }

    clear() {
        ['orderNumber', 'codeText', 'recipientName', 'recipientAddress', 'senderInfo'].forEach(id => {
            this.elements[id].value = '';
        });

        this.elements.preview.innerHTML = `
            <div class="label-preview-empty">
                <div class="label-preview-empty-icon">📦</div>
                <div>Sua etiqueta aparecerá aqui</div>
            </div>
        `;
        this.showMessage('Dados limpos', 'info');
    }

   async downloadPDF() {
    const label = this.elements.preview.querySelector('.label-shipping-label');
    if (!label) {
        this.showMessage('Gere uma etiqueta primeiro', 'error');
        return;
    }

    try {
        this.showMessage('Gerando PDF...', 'info');

        // ⏳ Espera para garantir que QR Code e barcode renderizem completamente
        await new Promise(resolve => setTimeout(resolve, 600));

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('portrait', 'mm', 'a4');

        // 🧭 Captura com fundo branco e melhor resolução
        const canvas = await html2canvas(label, {
            backgroundColor: '#ffffff',
            scale: 5,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png', 1.0);

        // 📝 Tamanho e posicionamento no PDF
        const pageWidth = 210; // A4 mm
        const imgWidth = 110;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const x = (pageWidth - imgWidth) / 2;
        const y = 10;

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

        const orderNum = this.elements.orderNumber.value || 'sem-numero';
        pdf.save(`etiqueta-${orderNum}.pdf`);

        this.showMessage('PDF baixado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        this.showMessage('Erro ao gerar PDF.', 'error');
    }
}

}

// inicializar
document.addEventListener('DOMContentLoaded', () => {
    new LabelGenerator();
});

// ============================================================
// BUSCA DE LOJAS — função corrigida
// Depende de: PHARM_DATA (scriptcards.js) + STORE_EXTRA (storedata.js)
// ============================================================

function buscarLoja() {
  const input = document.getElementById('storeSearchInput');
  const out   = document.getElementById('storeOut');
  if (!input || !out) return;

  const raw = input.value.trim();
  if (!raw) {
    out.innerHTML = '<p class="store-hint">Digite um termo acima para buscar.</p>';
    return;
  }

  // Normaliza o texto para comparação
  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const q = norm(raw);

  // ── Busca em PHARM_DATA (dados de turbo já no script) ──
  const pharmMatches = (typeof PHARM_DATA !== 'undefined' ? PHARM_DATA : []).filter(p => {
    const txt = norm(p['Java'] + ' ' + p['Farmácia'] + ' ' + p['Cidade'] + ' ' + p['UF'] + ' ' + p['CEP']);
    return txt.includes(q);
  });

  // ── Busca em STORE_EXTRA (dados completos) para complementar ──
  // Monta lista de javas já encontrados
  const pharmJavas = new Set(pharmMatches.map(p => String(p['Java'])));

  // Busca extras não cobertos pelo PHARM_DATA
  let extraMatches = [];
  if (typeof STORE_EXTRA !== 'undefined') {
    for (const [java, d] of Object.entries(STORE_EXTRA)) {
      if (pharmJavas.has(java)) continue; // já está na lista
      const txt = norm(java + ' ' + (d.login_tc || d.login) + ' ' + d.cidade + ' ' + d.estado + ' ' + d.bairro + ' ' + d.cep + ' ' + d.email);
      if (txt.includes(q)) extraMatches.push({ java, ...d });
      if (extraMatches.length >= 20) break; // limite para busca ampla
    }
  }

  const totalResults = pharmMatches.length + extraMatches.length;

  if (totalResults === 0) {
    out.innerHTML = '<p class="store-empty-msg">Nenhuma loja encontrada para "<strong>' + esc(raw) + '</strong>".</p>';
    return;
  }

  // ── Renderiza os resultados ──
  let html = `<div class="store-result-info">${totalResults} resultado${totalResults !== 1 ? 's' : ''} para "<strong>${esc(raw)}</strong>"</div>`;
  html += '<div class="store-result-grid">';

  // Renderiza resultados do PHARM_DATA (enriquecidos com STORE_EXTRA)
  pharmMatches.forEach(p => {
    const java   = String(p['Java']);
    const ex     = (typeof STORE_EXTRA !== 'undefined' && STORE_EXTRA[java]) ? STORE_EXTRA[java] : {};
    html += renderLojaCard(java, p['Farmácia'], p['Bandeira'], ex, p);
  });

  // Renderiza resultados extras
  extraMatches.forEach(d => {
    html += renderLojaCard(d.java, d.login_tc || d.login, null, d, null);
  });

  html += '</div>';
  out.innerHTML = html;
}

// ── Suporte: busca ao apertar Enter no campo ──
document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('storeSearchInput');
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') buscarLoja();
    });
  }
});

// ─────────────────────────────────────────────────────────────
// renderLojaCard — gera o card visual estilo "Resumo das Farmácias"
// ─────────────────────────────────────────────────────────────
function renderLojaCard(java, nome, bandeira, ex, pharm) {
  const ban  = bandeira || (ex.login && ex.login.startsWith('LJ') ? (ex.email || '').includes('raia') ? 'RAIA' : 'DROGASIL' : '');
  const banClass = ban === 'RAIA' ? 'badge--raia' : ban === 'DROGASIL' ? 'badge--dsil' : 'badge--other';

  // Campos da planilha
  const login        = ex.login_tc  || ex.login  || nome || '-';
  const senha        = ex.senha      || '-';
  const emailFilial  = ex.email      || '-';
  const ddd          = ex.ddd        || (pharm ? pharm['Cidade'] : '') || '';
  const tel          = ex.telefone   || '-';
  const cel          = ex.celular    || '-';
  const regional     = ex.regional   || '-';
  const emailReg     = ex.email_regional || '-';
  const gerente      = ex.gerente    || '-';
  const endereco     = ex.endereco   || (pharm ? '' : '-');
  const bairro       = ex.bairro     || '-';
  const cidade       = ex.cidade     || (pharm ? pharm['Cidade'] : '-') || '-';
  const estado       = ex.estado     || (pharm ? pharm['UF'] : '-') || '-';
  const cepRaw       = ex.cep        || (pharm ? pharm['CEP'] : '') || '';
  const cep          = formatarCEP(cepRaw);
  const inauguracao  = ex.inauguracao || '-';
  const folha        = ex.regiao     || '-';

  // Horários do PHARM_DATA
  const hSemana  = pharm ? pharm['SEG A SEX'] || '-' : '-';
  const hSab     = pharm ? pharm['SAB']       || '-' : '-';
  const hDom     = pharm ? pharm['DOM']       || '-' : '-';

  // Chips de capacidades
  const chips = [];
  if (pharm) {
    if (pharm['Antibióticos']  === 'SIM') chips.push('Antibióticos');
    if (pharm['Psicotrópicos'] === 'SIM') chips.push('Psicotrópicos');
    if (pharm['Termolábeis']   === 'SIM') chips.push('Termolábeis');
    if (pharm['Transportadora Turbo']) chips.push('Turbo: ' + pharm['Transportadora Turbo']);
  }

  const telFmt = ddd && tel !== '-' ? `(${ddd}) ${formatarTel(tel)}` : tel;
  const celFmt = cel !== '-' ? (ddd ? `(${ddd}) ${formatarTel(cel)}` : formatarTel(cel)) : '-';

  return `
<div class="loja-resumo-card">
  <!-- Cabeçalho verde RD Saúde -->
  <div class="loja-resumo-header">
    <div class="loja-resumo-logo">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff" opacity=".9"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>
      <span>RDsaúde</span>
    </div>
    <div class="loja-resumo-title">Resumo das Farmácias</div>
    <div class="loja-resumo-data-inau">
      <div class="loja-resumo-data-label">Data Inauguração</div>
      <div class="loja-resumo-data-value">${esc(inauguracao)}</div>
    </div>
  </div>

  <!-- Linha 1: Java + Nome + DDD + Telefone -->
  <div class="loja-resumo-grid loja-resumo-linha1">
    <div class="loja-resumo-cell loja-resumo-cell--label">Java</div>
    <div class="loja-resumo-cell loja-resumo-cell--value loja-resumo-java">${esc(java)}</div>
    <div class="loja-resumo-cell loja-resumo-cell--label">Nome</div>
    <div class="loja-resumo-cell loja-resumo-cell--value loja-resumo-nome">${esc(nome)}</div>
    <div class="loja-resumo-cell loja-resumo-cell--label">DDD</div>
    <div class="loja-resumo-cell loja-resumo-cell--label">Telefone</div>
  </div>

  <!-- Linha 2: Login + Senha + Email + Bandeira + Tel + Cel -->
  <div class="loja-resumo-grid loja-resumo-linha2">
    <div class="loja-resumo-cell loja-resumo-cell--label">Login</div>
    <div class="loja-resumo-cell loja-resumo-cell--label">Senha</div>
    <div class="loja-resumo-cell loja-resumo-cell--label">E-mail Filial</div>
    <div class="loja-resumo-cell loja-resumo-cell--label">Bandeira</div>
    <div class="loja-resumo-cell loja-resumo-cell--value loja-resumo-ddd">${esc(ddd)}</div>
    <div class="loja-resumo-cell loja-resumo-cell--value loja-resumo-tel">${esc(formatarTel(tel))}</div>
  </div>

  <!-- Linha 3: valores de login/senha/email/bandeira + 2º tel -->
  <div class="loja-resumo-grid loja-resumo-linha3">
    <div class="loja-resumo-cell loja-resumo-cell--value">${esc(login)}</div>
    <div class="loja-resumo-cell loja-resumo-cell--value loja-resumo-senha">${esc(senha)}</div>
    <div class="loja-resumo-cell loja-resumo-cell--value loja-resumo-email-small">${esc(emailFilial)}</div>
    <div class="loja-resumo-cell loja-resumo-bandeira-box ${banClass}">${esc(ban || '-')}</div>
    <div class="loja-resumo-cell loja-resumo-cell--label">2º Telefone</div>
    <div class="loja-resumo-cell loja-resumo-cell--value">${esc(formatarTel(cel))}</div>
  </div>

  <!-- Linha 4: Regional -->
  <div class="loja-resumo-grid loja-resumo-linha4">
    <div class="loja-resumo-cell loja-resumo-cell--label loja-resumo-cell--green">Regional</div>
    <div class="loja-resumo-cell loja-resumo-cell--arrow">→</div>
    <div class="loja-resumo-cell loja-resumo-cell--value loja-resumo-regional" style="grid-column: span 2">${esc(regional)}</div>
    <div class="loja-resumo-cell loja-resumo-cell--label">E-mail Regional</div>
    <div class="loja-resumo-cell loja-resumo-cell--value loja-resumo-email-small">${esc(emailReg)}</div>
  </div>

  <!-- Linha 5: Gerente -->
  <div class="loja-resumo-grid loja-resumo-linha4">
    <div class="loja-resumo-cell loja-resumo-cell--label loja-resumo-cell--green">Gerente</div>
    <div class="loja-resumo-cell loja-resumo-cell--arrow">→</div>
    <div class="loja-resumo-cell loja-resumo-cell--value loja-resumo-gerente" style="grid-column: span 2">${esc(gerente)}</div>
    <div class="loja-resumo-cell loja-resumo-cell--label">Folha/Filial Work</div>
    <div class="loja-resumo-cell loja-resumo-cell--value">${esc(folha)}</div>
  </div>

  <!-- Linha 6: Endereço cabeçalhos -->
  <div class="loja-resumo-grid loja-resumo-linha-end-header">
    <div class="loja-resumo-cell loja-resumo-cell--label loja-resumo-cell--dark">Endereço, Nº</div>
    <div class="loja-resumo-cell loja-resumo-cell--label loja-resumo-cell--dark">Bairro</div>
    <div class="loja-resumo-cell loja-resumo-cell--label loja-resumo-cell--dark">Cidade</div>
    <div class="loja-resumo-cell loja-resumo-cell--label loja-resumo-cell--dark">Estado</div>
    <div class="loja-resumo-cell loja-resumo-cell--label loja-resumo-cell--dark">CEP</div>
  </div>

  <!-- Linha 7: Endereço valores -->
  <div class="loja-resumo-grid loja-resumo-linha-end-val">
    <div class="loja-resumo-cell loja-resumo-cell--value">${esc(endereco)}</div>
    <div class="loja-resumo-cell loja-resumo-cell--value">${esc(bairro)}</div>
    <div class="loja-resumo-cell loja-resumo-cell--value">${esc(cidade)}</div>
    <div class="loja-resumo-cell loja-resumo-cell--value">${esc(estado)}</div>
    <div class="loja-resumo-cell loja-resumo-cell--value">${esc(cep)}</div>
  </div>

  ${pharm ? `
  <!-- Linha horários -->
  <div class="loja-resumo-horarios">
    <div class="loja-resumo-hor-block">
      <div class="loja-resumo-hor-label">Seg–Sex</div>
      <div class="loja-resumo-hor-val">${esc(hSemana)}</div>
    </div>
    <div class="loja-resumo-hor-block">
      <div class="loja-resumo-hor-label">Sábado</div>
      <div class="loja-resumo-hor-val">${esc(hSab)}</div>
    </div>
    <div class="loja-resumo-hor-block">
      <div class="loja-resumo-hor-label">Domingo</div>
      <div class="loja-resumo-hor-val">${esc(hDom)}</div>
    </div>
    ${pharm['Leadtime Turbo'] ? `<div class="loja-resumo-hor-block"><div class="loja-resumo-hor-label">Turbo</div><div class="loja-resumo-hor-val">${esc(pharm['Leadtime Turbo'])}</div></div>` : ''}
  </div>
  ` : ''}

  ${chips.length ? `<div class="loja-chips">${chips.map(c => `<span class="loja-chip">${esc(c)}</span>`).join('')}</div>` : ''}
</div>`;
}

// ─── Helpers ───────────────────────────────────────────────
function formatarCEP(cep) {
  const s = String(cep || '').replace(/\D/g, '').padStart(8, '0');
  if (s.length === 8) return s.slice(0, 5) + '-' + s.slice(5);
  return cep || '-';
}

function formatarTel(tel) {
  const s = String(tel || '').replace(/\D/g, '');
  if (s.length === 8) return s.slice(0, 4) + '-' + s.slice(4);
  if (s.length === 9) return s.slice(0, 5) + '-' + s.slice(5);
  if (s.length === 10) return '(' + s.slice(0, 2) + ') ' + s.slice(2, 6) + '-' + s.slice(6);
  if (s.length === 11) return '(' + s.slice(0, 2) + ') ' + s.slice(2, 7) + '-' + s.slice(7);
  return tel || '-';
}
