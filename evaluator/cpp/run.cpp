#include <iostream>
#include <fstream>
#include <cstdlib>

int main()
{
    int compileResult = system("g++ code.cpp -o code.out 2> compile_errors.txt");

    if (compileResult != 0)
    {
        std::ifstream err("compile_errors.txt");
        std::string error((std::istreambuf_iterator<char>(err)),
                          std::istreambuf_iterator<char>());
        std::cout << "Compilation failed:\n"
                  << error << std::endl;
        return 1;
    }

    int runResult = system("./code.out < input.txt > output.txt 2> runtime_errors.txt");
    if (runResult != 0)
    {
        std::ifstream err("runtime_errors.txt");
        std::string error((std::istreambuf_iterator<char>(err)),
                          std::istreambuf_iterator<char>());
        std::cout << "Runtime error:\n"
                  << error << std::endl;
        return 1;
    }

    std::ifstream out("output.txt");
    std::string output((std::istreambuf_iterator<char>(out)),
                       std::istreambuf_iterator<char>());
    std::cout << output;

    return 0;
}
