def solution(x):
    # Your code here
    result = []
    mid = 110
    for c in x:
        disFromMid = abs(mid - ord(c) - 1)
        if 97 <= ord(c) < 110:
            result.append(chr(mid + disFromMid))
        elif 110 <= ord(c) <= 122:
            result.append(chr(mid - disFromMid))
        else:
            result.append(c)
    return "".join(result)


print(solution("Yvzs! I xzm'g yvorvev Lzmxv olhg srh qly zg gsv xlolmb!!"))
