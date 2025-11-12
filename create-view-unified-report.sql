CREATE VIEW vw_unified_report AS
select acp.id, acp.data_referente data_acompanhamento, acp.data_registro data_registro_acompanhamento,
tatv.nome atividade, atv.minutos minutos_atividade,
tacd.nome autocuidado, acd.minutos minutos_autocuidado,
prj.nome projeto, trb.minutos minutos_trabalho, tcn.nome tecnologia, cli.nome cliente,
asn.nome estudo, est.minutos minutos_estudo, dsc.nome disciplina, ac.nome area_conhecimento
from acompanhamentos acp
left join atividades atv on atv.id_acompanhamento = acp.id
left join tipos_atividade tatv on tatv.id = atv.id_tipo_atividade
left join autocuidados acd on acd.id_acompanhamento = acp.id
left join tipos_autocuidado tacd on tacd.id = acd.id_tipo_autocuidado
left join trabalhos trb on trb.id_acompanhamento = acp.id
left join projetos prj on prj.id = trb.id_projeto
left join tecnologias tcn on tcn.id = prj.id_tecnologia_principal
left join clientes cli on cli.id = prj.id_cliente
left join estudos est on est.id_acompanhamento = acp.id
left join assuntos asn on asn.id = est.id_assunto
left join disciplinas dsc on dsc.id = asn.id_disciplina
left join areas_conhecimento ac on ac.id = dsc.id_area_conhecimento;