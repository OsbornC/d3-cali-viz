import json

def clean_GINI(filename):
    content = {}
    with open(filename) as fn:
        for line in fn:
            data = line.strip().split()
            county, gini = ' '.join(data[:-1]), data[-1]
            content[county] = gini
    output_file = open("dataset/GINI.json", "w")
    json.dump(content, output_file, indent=4, sort_keys=False)
    output_file.close()
clean_GINI('dataset/GINI.txt')