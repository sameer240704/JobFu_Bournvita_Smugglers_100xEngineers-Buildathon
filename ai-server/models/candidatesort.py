import os

# Path to the folder containing the JSON files
folder_path = 'global2'

# Get a list of all .json files in the folder
json_files = [f for f in os.listdir(folder_path) if f.endswith('.json')]

# Sort the files for consistent renaming order (optional but recommended)
json_files.sort()

# Rename each file
for index, filename in enumerate(json_files, start=36):
    new_filename = f"candidate_{index}.json"
    src = os.path.join(folder_path, filename)
    dst = os.path.join(folder_path, new_filename)
    
    # Only rename if the destination file name is different
    if filename != new_filename:
        os.rename(src, dst)
        print(f"Renamed: {filename} -> {new_filename}")
