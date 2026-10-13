for d in ['src/stores', 'src/services', 'src/components/common', 'src/components/home', 'src/test']:
    os.makedirs(f'{base}/{d}', exist_ok=True)

for path, content in files.items():
    full = os.path.join(base, path)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)

total = sum(len(c.splitlines()) for c in files.values())
print(f'Fase 2 creada: {len(files)} archivos, {total} líneas totales')
for p in sorted(files):
    print(f'  {p}  ({len(files[p].splitlines())} líneas)')