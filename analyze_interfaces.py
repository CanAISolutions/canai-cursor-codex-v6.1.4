import csv
from collections import Counter

# Count interfaces per directory
dirs = Counter()
total_interfaces = 0

with open('interfaces_list.csv', 'r') as f:
    for line in f:
        total_interfaces += 1
        path = line.strip().split(',')[0]
        directory = path.split('\\')[0]
        dirs[directory] += 1

print(f"Total interfaces found: {total_interfaces}")
print(f"\nTop 30 directories by interface count:")
print("-" * 50)

for dir, count in dirs.most_common(30):
    percentage = (count / total_interfaces) * 100
    print(f"{count:5d} ({percentage:5.1f}%)  {dir}")

# Identify core project directories (exclude node_modules and third-party)
print(f"\n\nCore project directories (excluding node_modules):")
print("-" * 50)

core_dirs = []
excluded_dirs = ['canai-orbital', 'node_modules', 'tests']
excluded_count = 0

for dir, count in dirs.most_common():
    if not any(excluded in dir for excluded in excluded_dirs):
        core_dirs.append((dir, count))
    else:
        excluded_count += count

core_count = sum(count for _, count in core_dirs)
print(f"Core interfaces: {core_count}")
print(f"Excluded interfaces: {excluded_count}")
print(f"\nCore directories:")

for dir, count in core_dirs[:20]:
    print(f"{count:5d}  {dir}") 