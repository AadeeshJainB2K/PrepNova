# Quick Setup Guide: Using Ollama for Local AI Models

## What is Ollama?

Ollama allows you to run AI models locally on your machine, giving you:
- **Privacy**: All data stays on your machine
- **No API costs**: Free to use
- **Offline capability**: Works without internet
- **Fast responses**: No network latency

## Installation

### macOS
```bash
brew install ollama
```

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows
Download from: https://ollama.com/download

## Pull Models

After installing Ollama, pull the models you want to use:

```bash
# Llama 3.1 (8B) - Good balance
ollama pull llama3.1

# Mistral (7B) - Fast and efficient
ollama pull mistral

# Qwen 2.5 (7B) - Excellent for reasoning
ollama pull qwen2.5
```

## Start Ollama Server

```bash
ollama serve
```

The server will run on `http://localhost:11434`

## Using in Mock Tests

1. Make sure Ollama is running (`ollama serve`)
2. Go to mock test configuration page
3. Select a model from "Local Models (Ollama)" section
4. Start your test!

## Model Comparison

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| Llama 3.1 | 8B | Medium | High | General questions |
| Mistral | 7B | Fast | Good | Quick practice |
| Qwen 2.5 | 7B | Medium | High | Math & reasoning |

## Troubleshooting

**Error: "Failed to generate question"**
- Make sure Ollama is running: `ollama serve`
- Check if model is pulled: `ollama list`
- Try pulling the model again: `ollama pull llama3.1`

**Slow generation**
- Smaller models (7B) are faster than larger ones
- Ensure you have enough RAM (8GB+ recommended)
- Close other heavy applications

## Notes

- First generation might be slower as the model loads into memory
- Subsequent generations will be faster
- Local models work offline but require good hardware
