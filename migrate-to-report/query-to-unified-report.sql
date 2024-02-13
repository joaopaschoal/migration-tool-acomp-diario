select acp.id, acp.data_referente data_acompanhamento, acp.data_registro data_registro_acompanhamento,
tatv.nome atividade, atv.minutos minutos_atividade,
tacd.nome autocuidado, acd.minutos minutos_autocuidado,
prj.nome projeto, trb.minutos minutos_trabalho, tcn.nome tecnologia, cli.nome cliente,
asn.nome estudo, est.minutos minutos_estudo, dsc.nome disciplina, ac.nome area_conhecimento
from acompanhamento acp
left join atividade atv on atv.id_acompanhamento = acp.id
left join tipo_atividade tatv on tatv.id = atv.id_tipo_atividade
left join autocuidado acd on acd.id_acompanhamento = acp.id
left join tipo_autocuidado tacd on tacd.id = acd.id_tipo_autocuidado
left join trabalho trb on trb.id_acompanhamento = acp.id
left join projeto prj on prj.id = trb.id_projeto
left join tecnologia tcn on tcn.id = prj.id_tecnologia_principal
left join cliente cli on cli.id = prj.id_cliente
left join estudo est on est.id_acompanhamento = acp.id
left join assunto asn on asn.id = est.id_assunto
left join disciplina dsc on dsc.id = asn.id_disciplina
left join area_conhecimento ac on ac.id = dsc.id_area_conhecimento;