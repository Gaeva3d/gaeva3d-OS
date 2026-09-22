-- Dados operacionais iniciais da GAEVA.
-- Clientes e pedidos demonstrativos continuam no frontend até a integração do Auth.

insert into public.printers (name, model, technology, status, notes)
values
  ('Snapmaker U1', 'U1', 'fdm', 'available', 'Impressora FDM multicor'),
  ('Bambu Lab A1', 'A1', 'fdm', 'available', 'Impressora FDM'),
  ('Elegoo Saturn 4 Ultra 12K', 'Saturn 4 Ultra 12K', 'resin', 'available', 'Impressora de resina')
on conflict (name) do update
set
  model = excluded.model,
  technology = excluded.technology,
  notes = excluded.notes,
  updated_at = now();

