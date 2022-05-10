# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreateTime: 2021/6/3

import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="wallbreaker",
    version="1.0.3",
    description="🔨 Break Java Reverse Engineering form Memory World!",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="hluwa",
    author_email="hluwa888@gmail.com",
    url="https://github.com/hluwa/Wallbreaker",
    install_requires=[
        "frida",
        "click"
    ],
    keywords="frida android wallbreaker objectdump objectsearch classdump classsearch",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "License :: OSI Approved :: GNU General Public License v3 (GPLv3)",
        "Operating System :: MacOS :: MacOS X",
        "Operating System :: Microsoft :: Windows",
        "Operating System :: POSIX :: Linux",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.4",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
    ],
    packages=setuptools.find_packages(where='.', exclude=(), include=('*',)),
    package_data={
        "wallbreaker.agent.command": ["agent.js"]
    },
)
