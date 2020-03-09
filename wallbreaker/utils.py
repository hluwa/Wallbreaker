# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 2020/3/9 01:06


class DvmDescConverter:
    def __init__(self, desc):
        self.dvm_desc = desc

    def to_java(self):
        result = str(self.dvm_desc)
        result = result.strip()
        dim = 0
        while result.startswith('['):
            result = result[1:]
            dim += 1

        if result.startswith('L') and result.endswith(';'):
            result = result[1: -1]

        result = result.replace('/', '')

        result += "[]" * dim
        return result

    def short_name(self):
        result = self.to_java()
        if '.' in result:
            result = result[result.rindex(".") + 1:]
        return result
