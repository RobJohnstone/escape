#!/bin/bash

cd ${0%/*} # sets working directory to the one that the script is located in

function build {
	echo "build"
	grunt
}

function patch {
	echo "patch"
	grunt patch
	commit
}

function minor {
	echo "minor"
	grunt minor
	commit
}

function major {
	echo "major"
	grunt major
	commit
}

function commit {
	git commit -a
}

if [ "$1" = "build" ]; then
	build
fi
if [ "$1" = "patch" ]; then
	patch
fi
if [ "$1" = "minor" ]; then
	minor
fi
if [ "$1" = "major" ]; then
	major
fi